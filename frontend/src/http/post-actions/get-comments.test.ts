import { postScenarios } from '../../test/scenarios'
import { camelizeObject, snakeizeObject } from '../../utils'
import { getComments } from './get-comments'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')
vi.mock('../../utils', () => ({
  camelizeObject: vi.fn(data => data),
  snakeizeObject: vi.fn(data => data),
}))

describe('getComments', () => {
  const { post, comments } = snakeizeObject(postScenarios.standardPost())

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('fetches and transforms comments successfully', async () => {
    ;(axios.get as Mock).mockResolvedValueOnce({ data: comments })

    const result = await getComments(post.id)

    expect(axios.get).toHaveBeenCalledWith(`/posts/${post.id}/comments/`)
    expect(result).toEqual(comments.map(camelizeObject))
  })

  test('handles empty comments array', async () => {
    ;(axios.get as Mock).mockResolvedValueOnce({ data: [] })

    const result = await getComments(post.id)

    expect(result).toEqual([])
  })
})
