import { postFactory } from '../../test/factories'
import { snakeizeObject } from '../../utils'
import { getPosts } from './get-posts'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')
vi.mock('../../utils', () => ({
  camelizeObject: vi.fn(data => data),
  snakeizeObject: vi.fn(data => data),
}))

describe('getPosts', () => {
  const posts = snakeizeObject(postFactory.buildList(5))

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('fetches and transforms posts successfully', async () => {
    ;(axios.get as Mock).mockResolvedValueOnce({ data: posts })

    const result = await getPosts()

    expect(axios.get).toHaveBeenCalledWith('/posts/')
    expect(result).toEqual(posts)
  })
})
