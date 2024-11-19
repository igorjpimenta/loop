import { topicFactory } from '../../../../test/factories'
import { httpScenarios, postScenarios } from '../../../../test/scenarios'
import { useUser } from '../../../../context/user-context'
import { deletePost } from '../../../../http/posts/delete-post'
import { getPosts } from '../../../../http/posts/get-posts'
import { getTopics } from '../../../../http/posts/get-topics'
import { Posts } from './index'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  vi,
  type Mock,
} from 'vitest'

// Mock the useUser hook
vi.mock('../../../../context/user-context', () => ({
  useUser: vi.fn(),
}))
// Mock the getTopics function
vi.mock('../../../../http/posts/get-topics', () => ({
  getTopics: vi.fn(),
}))
// Mock the getPosts function
vi.mock('../../../../http/posts/get-posts', () => ({
  getPosts: vi.fn(),
}))
// Mock the deletePost function
vi.mock('../../../../http/posts/delete-post', () => ({
  deletePost: vi.fn(),
}))

describe('Posts', () => {
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

  const topics = topicFactory.buildList(4)
  const { users, posts } = postScenarios.multipleUserPosts({ content: 'Post ' })

  beforeEach(() => {
    ;(getTopics as Mock).mockResolvedValue(topics)
    ;(getPosts as Mock).mockResolvedValueOnce(posts)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    queryClient.clear()
  })

  describe('Non-authenticated user', () => {
    describe('Rendering', () => {
      beforeEach(() => {
        ;(useUser as Mock).mockReturnValue({
          isAuthenticated: false,
        })
      })

      test('does not render CreatePost component for non-authenticated user', async () => {
        // Test for default render without CreatePost component
        render(
          <QueryClientWrapper>
            <Posts />
          </QueryClientWrapper>
        )

        await waitFor(() =>
          expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
        )

        expect(
          screen.queryByTestId(/create-post-form/i)
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('Authenticated user', () => {
    beforeEach(() => {
      ;(useUser as Mock).mockReturnValue({
        isAuthenticated: true,
        user: users[0],
      })
    })

    describe('Rendering', () => {
      test('renders loading state while fetching posts', () => {
        // Test for loading state
        ;(getPosts as Mock).mockReturnValue(httpScenarios.loading())

        render(
          <QueryClientWrapper>
            <Posts />
          </QueryClientWrapper>
        )

        expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument()
      })

      test('renders posts when fetched successfully', async () => {
        // Test for default render with posts
        render(
          <QueryClientWrapper>
            <Posts />
          </QueryClientWrapper>
        )

        await waitFor(() =>
          expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
        )

        expect(getPosts).toHaveBeenCalled()
        expect(screen.getByTestId(/posts-list/i)).toBeInTheDocument()
        expect(screen.getByText(/post 1/i)).toBeInTheDocument()
        expect(screen.getByText(/post 2/i)).toBeInTheDocument()
      })

      test('renders "No posts found" message when there are no posts', async () => {
        // Test for default render with no posts
        ;(getPosts as Mock).mockRestore()
        ;(getPosts as Mock).mockResolvedValue([])

        render(
          <QueryClientWrapper>
            <Posts />
          </QueryClientWrapper>
        )

        await waitFor(() =>
          expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
        )

        expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
      })

      test('renders CreatePost component for authenticated user', async () => {
        // Test for default render with CreatePost component
        render(
          <QueryClientWrapper>
            <Posts />
          </QueryClientWrapper>
        )

        await waitFor(() =>
          expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
        )

        expect(screen.getByTestId(/create-post-form/i)).toBeInTheDocument()
      })
    })

    describe('Events', () => {
      beforeEach(async () => {
        render(
          <QueryClientWrapper>
            <Posts />
          </QueryClientWrapper>
        )

        await waitFor(() =>
          expect(screen.queryByText(/loading\.\.\./i)).not.toBeInTheDocument()
        )
      })

      test('handles post creation', async () => {
        // Test for post creation
        fireEvent.change(screen.getByTestId(/content-textarea/i), {
          target: { value: 'Post 3' },
        })
        fireEvent.change(screen.getByTestId(/topics-select/i), {
          value: ['topic1'],
        })

        fireEvent.click(screen.getByTestId(/send-button/i))

        await waitFor(() => {
          expect(screen.queryByText(/post 3/i)).toBeInTheDocument()
        })
      })

      test('handles post deletion', async () => {
        // Test for post deletion
        fireEvent.click(screen.getByTestId(/delete-post-button/i))
        fireEvent.click(screen.getByRole('button', { name: /delete/i }))

        expect(deletePost).toHaveBeenCalledWith('post1')
        await waitFor(() => {
          expect(screen.queryByText(/post 1/i)).not.toBeInTheDocument()
        })
      })
    })
  })
})
