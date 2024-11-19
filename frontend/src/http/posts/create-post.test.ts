import type { DeepPartial } from '../../types/test-factory'
import { createPostHttpScenarios, postScenarios } from '../../test/scenarios'
import { camelizeObject, snakeizeObject } from '../../utils'
import { createPost } from './create-post'
import type { Post } from './get-posts'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')
vi.mock('../../utils', () => ({
  camelizeObject: vi.fn(data => data),
  snakeizeObject: vi.fn(data => data),
}))

describe('createPost', () => {
  const mockData = (overrides?: DeepPartial<Post>) => {
    const { post } = snakeizeObject(
      postScenarios.standardPost({ image: 'image.jpg', ...overrides })
    )

    return {
      formData: {
        userId: post.user.id,
        content: post.content,
        topics: post.topics.map(topic => topic.id),
        ...(post.image && {
          image: new File(['test'], post.image, { type: 'image/jpeg' }),
        }),
      },

      response: createPostHttpScenarios.postCreated(post),
    }
  }

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })

  describe('Create Post Success', () => {
    test('creates post successfully with all fields', async () => {
      const { formData, response } = mockData()
      ;(axios.post as Mock).mockResolvedValueOnce(response)

      const result = await createPost(formData)
      const calledFormData = (axios.post as Mock).mock.calls[0][1]

      expect(calledFormData.has('user_id')).toBeTruthy()
      expect(calledFormData.has('content')).toBeTruthy()
      expect(calledFormData.has('topics_ids')).toBeTruthy()
      expect(calledFormData.has('image')).toBeTruthy()
      expect(calledFormData.get('image')).toBeInstanceOf(File)

      expect(axios.post).toHaveBeenCalledWith('/posts/', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      expect(result).toBe(camelizeObject(response.data))
    })

    test('creates post successfully without image', async () => {
      const { formData, response } = mockData({ image: undefined })
      ;(axios.post as Mock).mockResolvedValueOnce(response)

      const result = await createPost(formData)
      const calledFormData = (axios.post as Mock).mock.calls[0][1]

      expect(calledFormData.has('user_id')).toBeTruthy()
      expect(calledFormData.has('content')).toBeTruthy()
      expect(calledFormData.has('topics_ids')).toBeTruthy()
      expect(calledFormData.has('image')).toBeFalsy()

      expect(result).toBe(camelizeObject(response.data))
    })
  })

  describe('Validation Errors', () => {
    test('handles one of each validation error', async () => {
      const { formData } = mockData()
      const error = createPostHttpScenarios.oneOfEach()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createPost(formData)).rejects.toEqual(error)
    })

    test('handles missing user id', async () => {
      const { formData } = mockData()
      const error = createPostHttpScenarios.missingUserId()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createPost(formData)).rejects.toEqual(error)
    })

    test('handles missing content', async () => {
      const { formData } = mockData()
      const error = createPostHttpScenarios.missingContent()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createPost(formData)).rejects.toEqual(error)
    })

    test('handles missing topics', async () => {
      const { formData } = mockData()
      const error = createPostHttpScenarios.missingTopics()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createPost(formData)).rejects.toEqual(error)
    })
  })

  describe('CSRF Token Validation', () => {
    test('handles missing CSRF token', async () => {
      const { formData } = mockData()
      const error = createPostHttpScenarios.missingCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createPost(formData)).rejects.toEqual(error)
    })

    test('handles invalid CSRF token', async () => {
      const { formData } = mockData()

      // Set up invalid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'invalid-token-that-have-32-char-',
      }

      const error = createPostHttpScenarios.invalidCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createPost(formData)).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      const { formData } = mockData()

      // Set up CSRF token with incorrect length
      axios.defaults.headers.common = {
        'X-CSRFToken': 'short-token',
      }

      const error = createPostHttpScenarios.invalidCsrfLength()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(createPost(formData)).rejects.toEqual(error)
    })
  })
})
