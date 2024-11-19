import { downvotePostHttpScenarios, postScenarios } from '../../test/scenarios'
import { downvotePost } from './downvote-post'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('Downvote', () => {
  const { post } = postScenarios.standardPost()

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })

  describe('Authenticated user', () => {
    test('downvotes post successfully', async () => {
      ;(axios.post as Mock).mockResolvedValueOnce(
        downvotePostHttpScenarios.downvoted()
      )

      await expect(downvotePost(post.id)).resolves.toBeUndefined()
      expect(axios.post).toHaveBeenCalledWith(`/posts/${post.id}/downvote/`)
    })

    test('handles already downvoted post', async () => {
      const error = downvotePostHttpScenarios.alreadyDownvoted()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(downvotePost(post.id)).rejects.toEqual(error)
    })
  })

  describe('CSRF Token Validation', () => {
    test('handles missing CSRF token', async () => {
      const error = downvotePostHttpScenarios.missingCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(downvotePost(post.id)).rejects.toEqual(error)
    })

    test('handles invalid CSRF token', async () => {
      // Set up invalid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'invalid-token-that-have-32-char-',
      }

      const error = downvotePostHttpScenarios.invalidCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(downvotePost(post.id)).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      // Set up CSRF token with incorrect length
      axios.defaults.headers.common = {
        'X-CSRFToken': 'short-token',
      }

      const error = downvotePostHttpScenarios.invalidCsrfLength()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(downvotePost(post.id)).rejects.toEqual(error)
    })
  })
})
