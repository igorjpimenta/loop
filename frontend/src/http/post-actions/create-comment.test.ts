import type { DeepPartial } from '../../types/test-factory'
import { createCommentHttpScenarios, postScenarios } from '../../test/scenarios'
import { camelizeObject, snakeizeObject } from '../../utils'
import { createComment } from './create-comment'
import type { Comment } from './get-comments'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')
vi.mock('../../utils', () => ({
  camelizeObject: vi.fn(data => data),
  snakeizeObject: vi.fn(data => data),
}))

describe('createComment', () => {
  const mockData = (overrides?: DeepPartial<Comment>) => {
    const { post, comments } = snakeizeObject(postScenarios.standardPost())
    const comment = snakeizeObject({
      ...comments[0],
      image: 'image.jpg',
      ...overrides,
    })

    return {
      formData: {
        postId: post.id,
        content: comment.content,
        ...(comment.image && {
          image: new File(['test'], comment.image, { type: 'image/jpeg' }),
        }),
      },
      response: createCommentHttpScenarios.commentCreated(comment),
    }
  }

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })

  describe('Create Comment Success', () => {
    test('creates comment successfully with all fields', async () => {
      const { formData, response } = mockData()
      ;(axios.post as Mock).mockResolvedValueOnce(response)

      const result = await createComment(formData)
      const calledFormData = (axios.post as Mock).mock.calls[0][1]

      expect(calledFormData.has('content')).toBeTruthy()
      expect(calledFormData.has('image')).toBeTruthy()
      expect(calledFormData.get('image')).toBeInstanceOf(File)

      expect(axios.post).toHaveBeenCalledWith(
        `/posts/${formData.postId}/comments/`,
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      expect(result).toBe(camelizeObject(response.data))
    })

    test('creates comment successfully without image', async () => {
      const { formData, response } = mockData({ image: undefined })
      ;(axios.post as Mock).mockResolvedValueOnce(response)

      const result = await createComment(formData)
      const calledFormData = (axios.post as Mock).mock.calls[0][1]

      expect(calledFormData.has('content')).toBeTruthy()
      expect(calledFormData.has('image')).toBeFalsy()

      expect(result).toBe(camelizeObject(response.data))
    })
  })

  describe('Validation Errors', () => {
    test('handles missing content', async () => {
      const { formData } = mockData()
      const error = createCommentHttpScenarios.missingContent()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createComment(formData)).rejects.toEqual(error)
    })
  })

  describe('CSRF Token Validation', () => {
    test('handles missing CSRF token', async () => {
      const { formData } = mockData()
      const error = createCommentHttpScenarios.missingCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createComment(formData)).rejects.toEqual(error)
    })

    test('handles invalid CSRF token', async () => {
      const { formData } = mockData()

      // Set up invalid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'invalid-token-that-have-32-char-',
      }

      const error = createCommentHttpScenarios.invalidCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createComment(formData)).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      const { formData } = mockData()

      // Set up CSRF token with incorrect length
      axios.defaults.headers.common = {
        'X-CSRFToken': 'short-token',
      }

      const error = createCommentHttpScenarios.invalidCsrfLength()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createComment(formData)).rejects.toEqual(error)
    })
  })
})
