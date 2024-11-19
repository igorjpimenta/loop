import { httpScenarios, userScenarios } from '../../../../test/scenarios'
import { useUser } from '../../../../context/user-context'
import { deleteComment } from '../../../../http/post-actions/delete-comment'
import { commentFactory } from '../../../../test/factories'
import { CommentCard } from './comment-card'

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

// Mock the deleteComment function
vi.mock('../../../../http/post-actions/delete-comment', () => ({
  deleteComment: vi.fn(),
}))

describe('CommentCard', () => {
  const mockOnDelete = vi.fn()
  const { user, anotherUser } = userScenarios
  const comment = commentFactory.build({ user, content: 'This is a comment' })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('Non-owner user', () => {
    beforeEach(() => {
      ;(useUser as Mock).mockReturnValue({
        isAuthenticated: true,
        user: anotherUser,
      })
    })

    describe('Rendering', () => {
      test('does not show delete button for authenticated user who is not the owner', () => {
        // Test render of delete button for a non-owner user
        render(<CommentCard comment={comment} onDelete={mockOnDelete} />)

        expect(
          screen.queryByTestId('delete-comment-button')
        ).not.toBeInTheDocument()
      })
    })

    test('renders comment with user info and content', () => {
      // Test for default render
      render(<CommentCard comment={comment} onDelete={mockOnDelete} />)

      expect(screen.getByText(/^j$/i)).toBeInTheDocument() // User's initial
      expect(screen.getByText(/johndoe/i)).toBeInTheDocument() // Username
      expect(screen.getByText(/this is a comment/i)).toBeInTheDocument() // Comment content
    })
  })

  describe('Owner user', () => {
    beforeEach(() => {
      ;(useUser as Mock).mockReturnValue({
        isAuthenticated: true,
        user,
      })
    })

    describe('Rendering', () => {
      test('shows delete button for authenticated user who is the owner', () => {
        // Test render of delete button for the comment owner
        render(<CommentCard comment={comment} onDelete={mockOnDelete} />)

        expect(screen.getByTestId('delete-comment-button')).toBeInTheDocument()
      })

      test('displays loading state while deleting', async () => {
        ;(deleteComment as Mock).mockReturnValue(httpScenarios.loading())

        render(<CommentCard comment={comment} onDelete={mockOnDelete} />)

        fireEvent.click(screen.getByTestId('delete-comment-button'))
        expect(screen.getByTestId('delete-comment-button')).toBeDisabled()
      })
    })

    describe('Events', () => {
      test('calls onDelete when delete button is clicked', async () => {
        // Test delete button click
        render(<CommentCard comment={comment} onDelete={mockOnDelete} />)

        fireEvent.click(screen.getByTestId('delete-comment-button'))
        await waitFor(() => expect(mockOnDelete).toHaveBeenCalled())
      })
    })
  })
})
