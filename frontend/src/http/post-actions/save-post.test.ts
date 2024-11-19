import { savePostHttpScenarios, postScenarios } from '../../test/scenarios'
import { savePost } from './save-post'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('Save Post', () => {
  const { post } = postScenarios.standardPost()

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })
  describe('Authenticated user', () => {
    test('saves post successfully', async () => {
      ;(axios.post as Mock).mockResolvedValueOnce(savePostHttpScenarios.saved())

      await expect(savePost(post.id)).resolves.toBeUndefined()
      expect(axios.post).toHaveBeenCalledWith(`/posts/${post.id}/save/`)
    })

    test('handles already saved post', async () => {
      const error = savePostHttpScenarios.alreadySaved()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(savePost(post.id)).rejects.toEqual(error)
    })
  })

  describe('CSRF Token Validation', () => {
    test('handles missing CSRF token', async () => {
      const error = savePostHttpScenarios.missingCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(savePost(post.id)).rejects.toEqual(error)
    })

    test('handles invalid CSRF token', async () => {
      // Set up invalid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'invalid-token-that-have-32-char-',
      }

      const error = savePostHttpScenarios.invalidCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(savePost(post.id)).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      // Set up CSRF token with incorrect length
      axios.defaults.headers.common = {
        'X-CSRFToken': 'short-token',
      }

      const error = savePostHttpScenarios.invalidCsrfLength()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(savePost(post.id)).rejects.toEqual(error)
    })
  })
})
