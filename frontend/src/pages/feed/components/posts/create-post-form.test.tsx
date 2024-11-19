import { httpScenarios, userScenarios } from '../../../../test/scenarios'
import { topicFactory } from '../../../../test/factories'
import { useUser } from '../../../../context/user-context'
import { createPost } from '../../../../http/posts/create-post'
import { getTopics } from '../../../../http/posts/get-topics'
import { CreatePost } from './create-post-form'

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
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
// Mock the createPost function
vi.mock('../../../../http/posts/create-post', () => ({
  createPost: vi.fn(),
}))
// Mock the getTopics function
vi.mock('../../../../http/posts/get-topics', () => ({
  getTopics: vi.fn(),
}))

describe('CreatePost', () => {
  const { user } = userScenarios
  const topics = topicFactory.buildList(4)

  const mockOnPostCreated = vi.fn()

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'mock-url')
    ;(useUser as Mock).mockReturnValue({
      isAuthenticated: true,
      user,
    })
    ;(getTopics as Mock).mockResolvedValue(topics)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    test('renders form with textarea, topic selection, and submit button', async () => {
      // Test for default render
      await act(async () => {
        render(
          <CreatePost userId={user.id} onPostCreated={mockOnPostCreated} />
        )
      })

      expect(screen.getByTestId(/content-textarea/i)).toBeInTheDocument()
      expect(screen.getByTestId(/topics-select/i)).toBeInTheDocument()

      expect(screen.getByText(/topic 1/i)).toBeInTheDocument()
      expect(screen.getByText(/topic 2/i)).toBeInTheDocument()
      expect(screen.getByText(/topic 3/i)).toBeInTheDocument()
      expect(screen.getByText(/topic 4/i)).toBeInTheDocument()

      expect(screen.getByTestId(/image-input/i)).toBeInTheDocument()
      expect(screen.getByTestId(/send-button/i)).toBeInTheDocument()
    })

    test('checks if image is displayed', async () => {
      // Test for image display
      render(<CreatePost userId={user.id} onPostCreated={mockOnPostCreated} />)

      const imageInput = screen.getByTestId(/image-input/i)
      const file = new File(['dummy content'], 'example.png', {
        type: 'image/png',
      })

      await act(async () => {
        fireEvent.change(imageInput, {
          target: { files: [file] },
        })
      })
      expect(screen.getByTestId(/image-preview/i)).toBeInTheDocument()
    })

    test('displays loading state while submitting', async () => {
      // Test for loading state
      ;(createPost as Mock).mockReturnValue(httpScenarios.loading())

      await act(async () => {
        render(
          <CreatePost userId={user.id} onPostCreated={mockOnPostCreated} />
        )
      })

      const contentTextarea = screen.getByTestId(/content-textarea/i)

      fireEvent.change(contentTextarea, {
        target: { value: 'This is a post.' },
      })

      fireEvent.click(screen.getByText(/topic 1/i).closest('label')!)

      fireEvent.click(screen.getByTestId(/send-button/i))
      expect(await screen.findByTestId(/send-button/i)).toBeDisabled()
    })
  })

  describe('Validation', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <CreatePost userId={user.id} onPostCreated={mockOnPostCreated} />
        )
      })
    })

    test('validates fields missing content, image and topics', async () => {
      // Test for content validation missing content, image and topics
      const contentTextarea = screen.getByTestId(/content-textarea/i)
      const imageInput = screen.getByTestId(/image-input/i)
      const sendButton = screen.getByTestId(/send-button/i)

      fireEvent.change(contentTextarea, {
        target: { value: '' },
      })

      fireEvent.change(screen.getByTestId(/topics-select/i), {
        value: [],
      })

      fireEvent.change(imageInput, {
        target: {
          files: [],
        },
      })

      fireEvent.click(sendButton)

      expect(
        await screen.findByText(/content is required/i)
      ).toBeInTheDocument()
      expect(
        await screen.findByText(/select at least one topic/i)
      ).toBeInTheDocument()
    })

    test('validates fields missing content', async () => {
      // Test for content validation missing content with image and topics
      const contentTextarea = screen.getByTestId(/content-textarea/i)
      const imageInput = screen.getByTestId(/image-input/i)
      const sendButton = screen.getByTestId(/send-button/i)

      fireEvent.change(contentTextarea, {
        target: { value: '' },
      })

      fireEvent.click(screen.getByText(/topic 1/i).closest('label')!)

      fireEvent.change(imageInput, {
        target: {
          files: [
            new File(['dummy content'], 'example.png', { type: 'image/png' }),
          ],
        },
      })

      fireEvent.click(sendButton)
      expect(
        await screen.findByText(/content is required/i)
      ).toBeInTheDocument()
    })

    test('validates more than 3 topics selected', async () => {
      // Test for more than 3 topics selected
      for (let i = 0; i < 4; i++) {
        fireEvent.click(screen.getByText(`Topic ${i + 1}`).closest('label')!)
      }

      expect(
        await screen.findByText(/maximum 3 topics allowed/i)
      ).toBeInTheDocument()
    })

    test('handles image upload validation of unsupported file types', async () => {
      // Test for invalid image file type
      const imageInput = screen.getByTestId(/image-input/i)

      fireEvent.change(imageInput, {
        target: {
          files: [new File(['dummy content'], 'test.docx', { type: 'docx' })],
        },
      })

      expect(
        await screen.findByText(
          /only .jpg, .jpeg, .png and .webp shapes are supported/i
        )
      ).toBeInTheDocument()
    })
  })

  describe('Events', () => {
    const onPostCreated = vi.fn().mockResolvedValueOnce(undefined)

    beforeEach(async () => {
      await act(async () => {
        render(<CreatePost userId={user.id} onPostCreated={onPostCreated} />)
      })
    })

    test('calls onPostCreated with valid data (content and topics filled)', async () => {
      // Test for sending a valid post with content and topics filled
      const contentTextarea = screen.getByTestId(/content-textarea/i)
      const imageInput = screen.getByTestId(/image-input/i)
      const sendButton = screen.getByTestId(/send-button/i)

      fireEvent.change(contentTextarea, {
        target: { value: 'This is a post.' },
      })

      fireEvent.click(screen.getByText(/topic 1/i).closest('label')!)
      fireEvent.click(screen.getByText(/topic 2/i).closest('label')!)

      fireEvent.change(imageInput, {
        target: {
          files: [],
        },
      })

      fireEvent.click(sendButton)
      await waitFor(() => expect(onPostCreated).toHaveBeenCalled())
    })

    test('calls onPostCreated with valid data (content, topics and image filled)', async () => {
      // Test for sending a valid post with content, topics and image filled
      const contentTextarea = screen.getByTestId(/content-textarea/i)
      const imageInput = screen.getByTestId(/image-input/i)
      const sendButton = screen.getByTestId(/send-button/i)

      fireEvent.change(contentTextarea, {
        target: { value: 'This is a post.' },
      })

      fireEvent.click(screen.getByText(/topic 1/i).closest('label')!)
      fireEvent.click(screen.getByText(/topic 2/i).closest('label')!)
      fireEvent.click(screen.getByText(/topic 3/i).closest('label')!)

      fireEvent.change(imageInput, {
        target: {
          files: [
            new File(['dummy content'], 'example.png', { type: 'image/png' }),
          ],
        },
      })

      fireEvent.click(sendButton)
      await waitFor(() => expect(onPostCreated).toHaveBeenCalled())
    })
  })
})
