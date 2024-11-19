import { postScenarios, unsavePostHttpScenarios } from '../../test/scenarios'
import { unsavePost } from './unsave-post'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('Unsave Post', () => {
  const { post } = postScenarios.standardPost()

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })

  describe('Authenticated user', () => {
    test('unsaves post successfully', async () => {
      ;(axios.delete as Mock).mockResolvedValueOnce(
        unsavePostHttpScenarios.unsaved()
      )

      await expect(unsavePost(post.id)).resolves.toBeUndefined()
      expect(axios.delete).toHaveBeenCalledWith(`/posts/${post.id}/save/`)
    })

    test('handles not saved post', async () => {
      const error = unsavePostHttpScenarios.notSaved()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(unsavePost(post.id)).rejects.toEqual(error)
    })
  })

  describe('CSRF Token Validation', () => {
    test('handles missing CSRF token', async () => {
      const error = unsavePostHttpScenarios.missingCsrf()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(unsavePost(post.id)).rejects.toEqual(error)
    })

    test('handles invalid CSRF token', async () => {
      // Set up invalid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'invalid-token-that-have-32-char-',
      }

      const error = unsavePostHttpScenarios.invalidCsrf()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(unsavePost(post.id)).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      // Set up CSRF token with incorrect length
      axios.defaults.headers.common = {
        'X-CSRFToken': 'short-token',
      }

      const error = unsavePostHttpScenarios.invalidCsrfLength()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(unsavePost(post.id)).rejects.toEqual(error)
    })
  })
})
