import { deleteCommentHttpScenarios, postScenarios } from '../../test/scenarios'
import { deleteComment } from './delete-comment'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('Delete Comment', () => {
  const { post, comments } = postScenarios.standardPost()
  const comment = comments[0]

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })

  describe('Authenticated user', () => {
    test('deletes comment successfully', async () => {
      ;(axios.delete as Mock).mockResolvedValueOnce(
        deleteCommentHttpScenarios.commentDeleted()
      )

      await expect(
        deleteComment({ postId: post.id, commentId: comment.id })
      ).resolves.toBeUndefined()
      expect(axios.delete).toHaveBeenCalledWith(
        `/posts/${post.id}/comments/${comment.id}/`
      )
    })

    test('handles unauthorized access', async () => {
      const error = deleteCommentHttpScenarios.unauthorized()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(
        deleteComment({ postId: post.id, commentId: comment.id })
      ).rejects.toEqual(error)
    })

    test('handles non-existent comment', async () => {
      const error = deleteCommentHttpScenarios.nonExistentComment()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(
        deleteComment({ postId: post.id, commentId: 'non-existent' })
      ).rejects.toEqual(error)
    })
  })

  describe('CSRF Token Validation', () => {
    test('handles missing CSRF token', async () => {
      const error = deleteCommentHttpScenarios.missingCsrf()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(
        deleteComment({ postId: post.id, commentId: comment.id })
      ).rejects.toEqual(error)
    })

    test('handles invalid CSRF token', async () => {
      // Set up invalid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'invalid-token-that-have-32-char-',
      }

      const error = deleteCommentHttpScenarios.invalidCsrf()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(
        deleteComment({ postId: post.id, commentId: comment.id })
      ).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      // Set up CSRF token with incorrect length
      axios.defaults.headers.common = {
        'X-CSRFToken': 'short-token',
      }

      const error = deleteCommentHttpScenarios.invalidCsrfLength()
      ;(axios.delete as Mock).mockRejectedValueOnce(error)

      await expect(
        deleteComment({ postId: post.id, commentId: comment.id })
      ).rejects.toEqual(error)
    })
  })
})
