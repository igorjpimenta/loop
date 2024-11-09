import type { SnakeizeKeys } from '../../types/case'
import { camelizeObject } from '../../utils'
import type { User } from '../../context/user-context'
import type { Topic } from './get-topics'

import axios from 'axios'

export interface Post {
  id: string
  user: User
  content: string
  image?: string
  topics: Topic[]
  createdAt: string
  updatedAt: string
  actions: {
    votes: number
    comments: number
    isUpvoted: boolean
    isDownvoted: boolean
    isSaved: boolean
  }
}

type GetPostsResponse = SnakeizeKeys<Post>[]

export async function getPosts(): Promise<Post[]> {
  const { data } = await axios.get<GetPostsResponse>('/posts/')
  const posts = data.map(camelizeObject)

  return posts
}
