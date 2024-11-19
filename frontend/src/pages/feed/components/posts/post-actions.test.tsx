import { postScenarios, userScenarios } from '../../../../test/scenarios'
import { useUser } from '../../../../context/user-context'
import { savePost } from '../../../../http/post-actions/save-post'
import { unsavePost } from '../../../../http/post-actions/unsave-post'
import { upvotePost } from '../../../../http/post-actions/upvote-post'
import { downvotePost } from '../../../../http/post-actions/downvote-post'
import { getComments } from '../../../../http/post-actions/get-comments'
import { PostActions } from './post-actions'

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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the useUser hook
vi.mock('../../../../context/user-context', () => ({
  useUser: vi.fn(),
}))

// Mock the post action functions
vi.mock('../../../../http/post-actions/save-post', () => ({
  savePost: vi.fn(),
}))

vi.mock('../../../../http/post-actions/unsave-post', () => ({
  unsavePost: vi.fn(),
}))

vi.mock('../../../../http/post-actions/upvote-post', () => ({
  upvotePost: vi.fn(),
}))

vi.mock('../../../../http/post-actions/downvote-post', () => ({
  downvotePost: vi.fn(),
}))

vi.mock('../../../../http/post-actions/get-comments', () => ({
  getComments: vi.fn(),
}))

describe('PostActions', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  const { user } = userScenarios

  beforeEach(() => {
    ;(useUser as Mock).mockReturnValue({
      isAuthenticated: true,
      user,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    queryClient.clear()
  })

  describe('Rendering', () => {
    test('checks for post actions buttons being rendered', () => {
      // Test for default state
      const { post } = postScenarios.standardPost()

      render(<PostActions post={post} />)

      expect(screen.getByTestId(/post-actions/i)).toBeInTheDocument()
      expect(screen.getByTestId(/save-button/i)).toBeInTheDocument()
      expect(screen.getByTestId(/upvote-button/i)).toBeInTheDocument()
      expect(screen.getByTestId(/downvote-button/i)).toBeInTheDocument()
      expect(screen.getByTestId(/comments-button/i)).toBeInTheDocument()
      expect(screen.queryByTestId(/^comments$/i)).not.toBeInTheDocument()
    })

    test('checks for filled icons when not voted or saved', () => {
      const { post } = postScenarios.postWithoutEngagement()

      render(<PostActions post={post} />)

      expect(
        screen.getByTestId(/save-button/i).querySelector('svg')
      ).not.toHaveClass('fill-current')

      expect(
        screen.getByTestId(/upvote-button/i).querySelector('svg')
      ).not.toHaveClass('fill-current')
      expect(
        screen.getByTestId(/downvote-button/i).querySelector('svg')
      ).not.toHaveClass('fill-current')
    })

    test('checks for labels text and count', () => {
      const { post } = postScenarios.postWithoutEngagement()

      render(<PostActions post={post} />)

      expect(screen.getByTestId(/save-button/i)).toHaveTextContent(/save/i)
      expect(screen.getByTestId(/votes/i)).toHaveTextContent(/0/i)
      expect(screen.getByTestId(/comments-button/i)).toHaveTextContent(/0/i)
    })
  })

  describe('Events', () => {
    describe('Save Button', () => {
      test('saves post when button is clicked and state is not saved', async () => {
        const { post } = postScenarios.postWithoutEngagement()

        render(<PostActions post={post} />)

        const saveButton = screen.getByTestId(/save-button/i)

        await waitFor(() => {
          fireEvent.click(saveButton)
        })

        expect(savePost).toHaveBeenCalledWith(post.id)
        expect(saveButton).toHaveTextContent(/saved/i)
        expect(saveButton.querySelector('svg')).toHaveClass('fill-current')
      })

      test('unsaves post when button is clicked and state is saved', async () => {
        const { post } = postScenarios.savedPost()

        render(<PostActions post={post} />)

        const saveButton = screen.getByTestId(/save-button/i)
        expect(saveButton).toHaveTextContent(/saved/i)
        expect(saveButton.querySelector('svg')).toHaveClass('fill-current')

        await waitFor(() => {
          fireEvent.click(saveButton)
        })

        expect(unsavePost).toHaveBeenCalledWith(post.id)
        expect(saveButton).toHaveTextContent(/save/i)
        expect(saveButton.querySelector('svg')).not.toHaveClass('fill-current')
      })
    })

    describe('Vote Button', () => {
      test('upvotes post when there is no vote state by the user', async () => {
        const { post } = postScenarios.postWithoutEngagement()

        render(<PostActions post={post} />)

        const votes = screen.getByTestId(/votes/i)
        const upvoteButton = screen.getByTestId(/upvote-button/i)
        const downvoteButton = screen.getByTestId(/downvote-button/i)

        expect(votes).toHaveTextContent(/0/i)
        expect(upvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
        expect(downvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )

        await waitFor(() => {
          fireEvent.click(upvoteButton)
        })

        expect(upvotePost).toHaveBeenCalledWith(post.id)
        expect(votes).toHaveTextContent(/1/i)
        expect(upvoteButton.querySelector('svg')).toHaveClass('fill-current')
        expect(downvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
      })

      test('upvotes post when already downvoted by the user', async () => {
        const { post } = postScenarios.downvotedPost()

        render(<PostActions post={post} />)

        const votes = screen.getByTestId(/votes/i)
        const upvoteButton = screen.getByTestId(/upvote-button/i)
        const downvoteButton = screen.getByTestId(/downvote-button/i)

        expect(votes).toHaveTextContent(/-1/i)
        expect(upvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
        expect(downvoteButton.querySelector('svg')).toHaveClass('fill-current')

        await waitFor(() => {
          fireEvent.click(upvoteButton)
        })

        expect(upvotePost).toHaveBeenCalledWith(post.id)
        expect(votes).toHaveTextContent(/1/i)
        expect(upvoteButton.querySelector('svg')).toHaveClass('fill-current')
        expect(downvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
      })

      test('downvotes post when there is no vote state by the user', async () => {
        const { post } = postScenarios.postWithoutEngagement()

        render(<PostActions post={post} />)

        const votes = screen.getByTestId(/votes/i)
        const upvoteButton = screen.getByTestId(/upvote-button/i)
        const downvoteButton = screen.getByTestId(/downvote-button/i)

        expect(votes).toHaveTextContent(/0/i)
        expect(upvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
        expect(downvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )

        await waitFor(() => {
          fireEvent.click(downvoteButton)
        })

        expect(downvotePost).toHaveBeenCalledWith(post.id)
        expect(votes).toHaveTextContent(/-1/i)
        expect(upvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
        expect(downvoteButton.querySelector('svg')).toHaveClass('fill-current')
      })

      test('downvotes post when already upvoted by the user', async () => {
        const { post } = postScenarios.upvotedPost()

        render(<PostActions post={post} />)

        const votes = screen.getByTestId(/votes/i)
        const upvoteButton = screen.getByTestId(/upvote-button/i)
        const downvoteButton = screen.getByTestId(/downvote-button/i)

        expect(votes).toHaveTextContent(/1/i)
        expect(upvoteButton.querySelector('svg')).toHaveClass('fill-current')
        expect(downvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )

        await waitFor(() => {
          fireEvent.click(downvoteButton)
        })

        expect(downvotePost).toHaveBeenCalledWith(post.id)
        expect(votes).toHaveTextContent(/-1/i)
        expect(upvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
        expect(downvoteButton.querySelector('svg')).toHaveClass('fill-current')
      })

      test('removes vote when upvoted and then clicked again', async () => {
        const { post } = postScenarios.upvotedPost()

        render(<PostActions post={post} />)

        const votes = screen.getByTestId(/votes/i)
        const upvoteButton = screen.getByTestId(/upvote-button/i)
        const downvoteButton = screen.getByTestId(/downvote-button/i)

        expect(votes).toHaveTextContent(/1/i)
        expect(upvoteButton.querySelector('svg')).toHaveClass('fill-current')
        expect(downvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )

        await waitFor(() => {
          fireEvent.click(upvoteButton)
        })

        expect(upvotePost).toHaveBeenCalledWith(post.id)
        expect(votes).toHaveTextContent(/0/i)
        expect(upvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
        expect(downvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
      })

      test('removes vote when downvoted and then clicked again', async () => {
        const { post } = postScenarios.downvotedPost()

        render(<PostActions post={post} />)

        const votes = screen.getByTestId(/votes/i)
        const upvoteButton = screen.getByTestId(/upvote-button/i)
        const downvoteButton = screen.getByTestId(/downvote-button/i)

        expect(votes).toHaveTextContent(/-1/i)
        expect(upvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
        expect(downvoteButton.querySelector('svg')).toHaveClass('fill-current')

        await waitFor(() => {
          fireEvent.click(downvoteButton)
        })

        expect(downvotePost).toHaveBeenCalledWith(post.id)
        expect(votes).toHaveTextContent(/0/i)
        expect(upvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
        expect(downvoteButton.querySelector('svg')).not.toHaveClass(
          'fill-current'
        )
      })
    })

    describe('Comments Button', () => {
      test('opens comments section when comments button is clicked', async () => {
        const { post, comments } = postScenarios.standardPost()
        ;(getComments as Mock).mockReturnValue(comments)

        render(
          <QueryClientWrapper>
            <PostActions post={post} />
          </QueryClientWrapper>
        )

        fireEvent.click(screen.getByTestId(/comments-button/i))
        await waitFor(() =>
          expect(screen.getByTestId(/^comments$/i)).toBeInTheDocument()
        )
      })
    })
  })
})
