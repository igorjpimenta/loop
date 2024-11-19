import { getTopics } from './get-topics'
import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'
import { topicFactory } from '../../test/factories'

vi.mock('axios')

describe('getTopics', () => {
  const topics = topicFactory.buildList(2)

  afterEach(() => {
    vi.clearAllMocks()
    axios.defaults.headers.common = {}
  })

  test('fetches topics successfully', async () => {
    ;(axios.get as Mock).mockResolvedValueOnce({ data: topics })

    const result = await getTopics()

    expect(axios.get).toHaveBeenCalledWith('/topics/')
    expect(result).toEqual(topics)
  })
})
