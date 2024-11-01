import { API_URL } from '../lib/config'
import type { SnakeizeKeys } from '../types/case'
import { camelizeObject } from '../utils'
import type { Topic } from './get-topics'

import axios from 'axios'

export interface Post {
  id: string
  username: string
  content: string
  image?: string
  topics: Topic[]
  createdAt: string
  updatedAt: string
}

type GetPostsResponse = SnakeizeKeys<Post>[]

export async function getPosts(): Promise<Post[]> {
  const { data } = await axios.get<GetPostsResponse>(`${API_URL}/api/posts/`)
  const posts = data.map(camelizeObject)

  return posts
}
