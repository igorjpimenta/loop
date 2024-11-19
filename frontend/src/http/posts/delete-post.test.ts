import { deletePostHttpScenarios, postScenarios } from '../../test/scenarios'
import { deletePost } from './delete-post'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('deletePost', () => {
  const { post } = postScenarios.standardPost()

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })

  describe('Authenticated user', () => {
    test('deletes post successfully', async () => {
      ;(axios.delete as Mock).mockResolvedValueOnce(
        deletePostHttpScenarios.postDeleted()
      )

      await expect(deletePost(post.id)).resolves.toBeUndefined()
      expect(axios.delete).toHaveBeenCalledWith(`/posts/${post.id}/`)
    })

    test('handles unauthorized access', async () => {
      const error = deletePostHttpScenarios.unauthorized()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(deletePost(post.id)).rejects.toEqual(error)
    })

    test('handles non-existent post', async () => {
      const error = deletePostHttpScenarios.nonExistentPost()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(deletePost(post.id)).rejects.toEqual(error)
    })
  })

  describe('Non-authenticated user', () => {
    test('handles missing csrf token', async () => {
      const error = deletePostHttpScenarios.missingCsrf()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(deletePost(post.id)).rejects.toEqual(error)
    })

    test('handles invalid csrf token', async () => {
      // Set up invalid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'invalid-token-that-have-32-char-',
      }

      const error = deletePostHttpScenarios.invalidCsrf()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(deletePost(post.id)).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      // Set up CSRF token with incorrect length
      axios.defaults.headers.common = {
        'X-CSRFToken': 'short-token',
      }

      const error = deletePostHttpScenarios.invalidCsrfLength()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(deletePost(post.id)).rejects.toEqual(error)
    })
  })
})
