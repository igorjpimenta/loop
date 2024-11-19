import {
  httpScenarios,
  postScenarios,
  userScenarios,
} from '../../../../test/scenarios'
import { useUser } from '../../../../context/user-context'
import { deletePost } from '../../../../http/posts/delete-post'
import { PostCard } from './post-card'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  describe,
  test,
  expect,
  vi,
  afterEach,
  beforeEach,
  type Mock,
} from 'vitest'

// Mock the useUser hook
vi.mock('../../../../context/user-context', () => ({
  useUser: vi.fn(),
}))

// Mock the deletePost function
vi.mock('../../../../http/posts/delete-post', () => ({
  deletePost: vi.fn(),
}))

describe('PostCard', () => {
  const mockOnDelete = vi.fn()
  const { user, anotherUser } = userScenarios

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('Unauthenticated user', () => {
    beforeEach(() => {
      ;(useUser as Mock).mockReturnValue({
        isAuthenticated: false,
      })
    })

    describe('Rendering', () => {
      test('renders post without image', () => {
        const { post } = postScenarios.postWithoutImage({ user })

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        expect(screen.getByText(/^j$/i)).toBeInTheDocument()
        expect(screen.getByText(/johndoe/i)).toBeInTheDocument()
        expect(screen.getByText(/no image post/i)).toBeInTheDocument()
        expect(screen.getByText(/topic 1/i)).toBeInTheDocument()
        expect(screen.getByText(/topic 2/i)).toBeInTheDocument()
        expect(screen.queryByTestId('post-actions')).not.toBeInTheDocument()
        expect(
          screen.queryByTestId('delete-post-button')
        ).not.toBeInTheDocument()
        expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument()
      })

      test('renders post with image', () => {
        const { post } = postScenarios.postWithImage({ user })

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        expect(screen.getByText(/^j$/i)).toBeInTheDocument()
        expect(screen.getByText(/johndoe/i)).toBeInTheDocument()
        expect(screen.getByText(/image post/i)).toBeInTheDocument()
        expect(screen.getByText(/topic 1/i)).toBeInTheDocument()
        expect(screen.getByText(/topic 2/i)).toBeInTheDocument()
        expect(screen.queryByTestId('post-actions')).not.toBeInTheDocument()
        expect(
          screen.queryByTestId('delete-post-button')
        ).not.toBeInTheDocument()
        expect(screen.queryByTestId('image-preview')).toBeInTheDocument()
      })
    })
  })

  describe('Authenticated user', () => {
    beforeEach(() => {
      ;(useUser as Mock).mockReturnValue({
        isAuthenticated: true,
        user,
      })
    })

    describe('Rendering', () => {
      test('renders post without image to user who is not the owner', () => {
        const { post } = postScenarios.postWithoutImage({ user: anotherUser })

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        expect(screen.getByText(/^j$/i)).toBeInTheDocument()
        expect(screen.getByText(/janedoe/i)).toBeInTheDocument()
        expect(screen.getByText(/no image post/i)).toBeInTheDocument()
        expect(screen.getByText(/topic 1/i)).toBeInTheDocument()
        expect(screen.getByText(/topic 2/i)).toBeInTheDocument()
        expect(screen.queryByTestId('post-actions')).toBeInTheDocument()
        expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument()
      })

      test('renders post with image to user who is not the owner', () => {
        const { post } = postScenarios.postWithImage({ user: anotherUser })

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        expect(screen.getByText(/^j$/i)).toBeInTheDocument()
        expect(screen.getByText(/janedoe/i)).toBeInTheDocument()
        expect(screen.getByText(/image post/i)).toBeInTheDocument()
        expect(screen.getByText(/topic 1/i)).toBeInTheDocument()
        expect(screen.getByText(/topic 2/i)).toBeInTheDocument()
        expect(screen.queryByTestId('post-actions')).toBeInTheDocument()
        expect(screen.queryByTestId('image-preview')).toBeInTheDocument()
      })

      test('shows delete button to user who is the owner', () => {
        const { post } = postScenarios.standardPost({ user })

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        expect(screen.getByTestId('delete-post-button')).toBeInTheDocument()
      })

      test('does not show delete button to user who is not the owner', () => {
        const { post } = postScenarios.standardPost({ user: anotherUser })

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        expect(
          screen.queryByTestId('delete-post-button')
        ).not.toBeInTheDocument()
      })

      test('displays loading state while deleting', async () => {
        const { post } = postScenarios.standardPost({ user })
        ;(deletePost as Mock).mockReturnValue(httpScenarios.loading())

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        fireEvent.click(screen.getByTestId('delete-post-button'))
        fireEvent.click(screen.getByRole('button', { name: /delete/i }))
        expect(screen.getByTestId('delete-post-button')).toBeDisabled()
      })

      test('displays delete modal', async () => {
        const { post } = postScenarios.postWithoutImage({ user })

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        await waitFor(async () => {
          fireEvent.click(screen.getByTestId('delete-post-button'))
        })
        expect(screen.getByTestId('delete-post-modal')).toBeInTheDocument()
      })
    })

    describe('Actions', () => {
      const { post } = postScenarios.standardPost({ user })

      test('opens delete modal when delete button is clicked', async () => {
        render(<PostCard post={post} onDelete={mockOnDelete} />)

        fireEvent.click(screen.getByTestId('delete-post-button'))
        expect(screen.getByText(/delete post\?/i)).toBeInTheDocument()
      })

      test('calls onDelete when delete button in modal is clicked', async () => {
        ;(deletePost as Mock).mockResolvedValue(undefined)

        render(<PostCard post={post} onDelete={mockOnDelete} />)

        await waitFor(async () => {
          fireEvent.click(screen.getByTestId('delete-post-button'))
          fireEvent.click(screen.getByRole('button', { name: /delete/i }))
        })
        expect(mockOnDelete).toHaveBeenCalled()
      })
    })
  })
})
