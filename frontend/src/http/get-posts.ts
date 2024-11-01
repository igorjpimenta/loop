import { API_URL } from '../lib/config'
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

export async function getPosts(): Promise<Post[]> {
  const { data } = await axios.get<Post[]>(`${API_URL}/api/posts/`)

  return data
}
