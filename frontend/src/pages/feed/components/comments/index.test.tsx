import {
  httpScenarios,
  postScenarios,
  userScenarios,
} from '../../../../test/scenarios'
import { useUser } from '../../../../context/user-context'
import { deleteComment } from '../../../../http/post-actions/delete-comment'
import { getComments } from '../../../../http/post-actions/get-comments'
import { Comments } from './index'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  describe,
  test,
  expect,
  beforeEach,
  vi,
  type Mock,
  afterEach,
} from 'vitest'
import { commentFactory } from '../../../../test/factories'

// Mock the useUser hook
vi.mock('../../../../context/user-context', () => ({
  useUser: vi.fn(),
}))
// Mock the getComments function
vi.mock('../../../../http/post-actions/get-comments', () => ({
  getComments: vi.fn(),
}))
// Mock the deleteComment function
vi.mock('../../../../http/post-actions/delete-comment', () => ({
  deleteComment: vi.fn(),
}))

describe('Comments', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  })
  const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
  const { user } = userScenarios
  const { post } = postScenarios.standardPost({ user })
  const comments = commentFactory.buildList(3, { user, postId: post.id })
  const mockOnCommentCreated = vi.fn()
  const mockOnCommentDeleted = vi.fn()

  beforeEach(() => {
    ;(useUser as Mock).mockReturnValue({
      isAuthenticated: true,
      user,
    })
    ;(getComments as Mock).mockResolvedValueOnce(comments)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    queryClient.clear()
  })

  describe('Rendering', () => {
    test('renders loading state while fetching comments', () => {
      // Test for loading state
      ;(getComments as Mock).mockReturnValue(httpScenarios.loading())

      render(
        <QueryClientWrapper>
          <Comments
            postId={post.id}
            onCommentCreated={mockOnCommentCreated}
            onCommentDeleted={mockOnCommentDeleted}
          />
        </QueryClientWrapper>
      )

      expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument()
    })

    test('renders comments when fetched successfully', async () => {
      // Test for default render with comments
      render(
        <QueryClientWrapper>
          <Comments
            postId={post.id}
            onCommentCreated={mockOnCommentCreated}
            onCommentDeleted={mockOnCommentDeleted}
          />
        </QueryClientWrapper>
      )

      await waitFor(() =>
        expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
      )

      expect(getComments).toHaveBeenCalledWith(post.id)
      expect(screen.getByTestId(/comments-list/i)).toBeInTheDocument()
      expect(screen.getByText(/this is a test comment 1/i)).toBeInTheDocument()
      expect(screen.getByText(/this is a test comment 2/i)).toBeInTheDocument()
      expect(screen.getByText(/this is a test comment 3/i)).toBeInTheDocument()
    })

    test('does not render comments list when there are no comments', async () => {
      // Test for default render with no comments
      ;(getComments as Mock).mockRestore()
      ;(getComments as Mock).mockResolvedValueOnce([])

      render(
        <QueryClientWrapper>
          <Comments
            postId={post.id}
            onCommentCreated={mockOnCommentCreated}
            onCommentDeleted={mockOnCommentDeleted}
          />
        </QueryClientWrapper>
      )

      await waitFor(() =>
        expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
      )

      expect(screen.queryByTestId(/comments-list/i)).not.toBeInTheDocument()
    })
  })

  describe('Events', () => {
    test('handles comment creation', async () => {
      // Test for comment creation
      render(
        <QueryClientWrapper>
          <Comments
            postId={post.id}
            onCommentCreated={mockOnCommentCreated}
            onCommentDeleted={mockOnCommentDeleted}
          />
        </QueryClientWrapper>
      )

      await waitFor(() =>
        expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
      )

      fireEvent.change(screen.getByTestId(/content-textarea/i), {
        target: { value: 'This is a new comment.' },
      })

      fireEvent.click(screen.getByTestId(/send-button/i))

      await waitFor(() => {
        expect(screen.getByText(/this is a new comment/i)).toBeInTheDocument()
      })
    })

    test('handles comment deletion', async () => {
      // Test for comment deletion
      render(
        <QueryClientWrapper>
          <Comments
            postId={post.id}
            onCommentCreated={mockOnCommentCreated}
            onCommentDeleted={mockOnCommentDeleted}
          />
        </QueryClientWrapper>
      )

      await waitFor(() =>
        expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
      )

      fireEvent.click(screen.getAllByTestId(/delete-comment-button/i)[1])

      expect(deleteComment).toHaveBeenCalledWith({
        commentId: comments[1].id,
        postId: post.id,
      })
      await waitFor(() => {
        expect(
          screen.queryByText(/this is the third comment/i)
        ).not.toBeInTheDocument()
      })
    })
  })
})
