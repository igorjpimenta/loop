import {
  httpScenarios,
  postScenarios,
  userScenarios,
} from '../../../../test/scenarios'
import { useUser } from '../../../../context/user-context'
import { createComment } from '../../../../http/post-actions/create-comment'
import { CreateCommentForm } from './create-comment-form'

import { render, screen, fireEvent, act } from '@testing-library/react'
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from 'vitest'

// Mock the useUser hook
vi.mock('../../../../context/user-context', () => ({
  useUser: vi.fn(),
}))
// Mock the createComment function
vi.mock('../../../../http/post-actions/create-comment', () => ({
  createComment: vi.fn(),
}))

describe('CreateCommentForm', () => {
  const mockOnCommentCreated = vi.fn()
  const { user } = userScenarios
  const { post } = postScenarios.standardPost({ user })

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'mock-url')
    ;(useUser as Mock).mockReturnValue({
      isAuthenticated: true,
      user,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    test('renders form with textarea and submit button', () => {
      // Test for default render
      render(
        <CreateCommentForm
          postId={post.id}
          onCommentCreated={mockOnCommentCreated}
        />
      )

      expect(screen.getByTestId(/content-textarea/i)).toBeInTheDocument()
      expect(screen.getByTestId(/image-input/i)).toBeInTheDocument()
      expect(screen.getByTestId(/send-button/i)).toBeInTheDocument()
    })

    test('checks if image is displayed', () => {
      // Test for image display
      render(
        <CreateCommentForm
          postId={post.id}
          onCommentCreated={mockOnCommentCreated}
        />
      )

      const imageInput = screen.getByTestId(/image-input/i)
      const file = new File(['dummy content'], 'example.png', {
        type: 'image/png',
      })

      fireEvent.change(imageInput, {
        target: { files: [file] },
      })
      expect(screen.getByTestId(/image-preview/i)).toBeInTheDocument()
    })

    test('displays loading state while submitting', async () => {
      // Test for loading state
      ;(createComment as Mock).mockReturnValue(httpScenarios.loading())

      render(
        <CreateCommentForm
          postId={post.id}
          onCommentCreated={mockOnCommentCreated}
        />
      )

      fireEvent.change(screen.getByTestId(/content-textarea/i), {
        target: { value: 'This is a comment.' },
      })

      fireEvent.click(screen.getByTestId(/send-button/i))
      expect(await screen.findByTestId(/send-button/i)).toBeDisabled()
    })
  })

  describe('Validation', () => {
    test('validates content field with no field filled', async () => {
      // Test with no field filled
      render(
        <CreateCommentForm
          postId={post.id}
          onCommentCreated={mockOnCommentCreated}
        />
      )

      fireEvent.change(screen.getByTestId(/content-textarea/i), {
        target: { value: '' },
      })

      fireEvent.click(screen.getByTestId(/send-button/i))
      expect(
        await screen.findByText(/content is required/i)
      ).toBeInTheDocument()
    })

    test('validates content field with only image field filled', async () => {
      // Test with image field filled and content field empty
      render(
        <CreateCommentForm
          postId={post.id}
          onCommentCreated={mockOnCommentCreated}
        />
      )

      const input = screen.getByTestId(/content-textarea/i)
      const imageInput = screen.getByTestId(/image-input/i)
      const button = screen.getByTestId(/send-button/i)

      const file = new File(['dummy content'], 'example.png', {
        type: 'image/png',
      })

      fireEvent.change(input, {
        target: { value: '' },
      })

      fireEvent.change(imageInput, {
        target: { files: [file] },
      })

      fireEvent.click(button)
      expect(
        await screen.findByText(/content is required/i)
      ).toBeInTheDocument()
    })

    test('handles image upload validation of unsupported file types', async () => {
      // Test for invalid image file type
      render(
        <CreateCommentForm
          postId={post.id}
          onCommentCreated={mockOnCommentCreated}
        />
      )

      const imageInput = screen.getByTestId(/image-input/i)
      const file = new File(['dummy content'], 'test.docx', { type: 'docx' })

      fireEvent.change(imageInput, {
        target: { files: [file] },
      })

      expect(
        await screen.findByText(
          /only .jpg, .jpeg, .png and .webp shapes are supported/i
        )
      ).toBeInTheDocument()
    })
  })

  describe('Events', () => {
    test('calls onCommentCreated with valid data (content and image)', async () => {
      // Test for valid data submission
      ;(createComment as Mock).mockResolvedValueOnce(undefined)
      const mockOnCommentCreated = vi.fn().mockResolvedValueOnce(undefined)

      render(
        <CreateCommentForm
          postId={post.id}
          onCommentCreated={mockOnCommentCreated}
        />
      )

      const input = screen.getByTestId(/content-textarea/i)
      const imageInput = screen.getByTestId(/image-input/i)
      const button = screen.getByTestId(/send-button/i)

      const file = new File(['dummy content'], 'example.png', {
        type: 'image/png',
      })

      fireEvent.change(input, {
        target: { value: 'This is a comment.' },
      })

      fireEvent.change(imageInput, {
        target: { files: [file] },
      })

      await act(() => fireEvent.click(button))
      expect(mockOnCommentCreated).toHaveBeenCalled()
    })
  })
})
