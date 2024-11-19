import { upvotePostHttpScenarios, postScenarios } from '../../test/scenarios'
import { upvotePost } from './upvote-post'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('Upvote', () => {
  const { post } = postScenarios.standardPost()

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })

  describe('Authenticated user', () => {
    test('upvotes post successfully', async () => {
      ;(axios.post as Mock).mockResolvedValueOnce(
        upvotePostHttpScenarios.upvoted()
      )

      await expect(upvotePost(post.id)).resolves.toBeUndefined()
      expect(axios.post).toHaveBeenCalledWith(`/posts/${post.id}/upvote/`)
    })

    test('handles already upvoted post', async () => {
      const error = upvotePostHttpScenarios.alreadyUpvoted()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(upvotePost(post.id)).rejects.toEqual(error)
    })
  })

  describe('Non-authenticated user', () => {
    test('handles missing CSRF token', async () => {
      const error = upvotePostHttpScenarios.missingCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(upvotePost(post.id)).rejects.toEqual(error)
    })
  })
})
