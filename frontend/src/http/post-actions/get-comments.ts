import type { SnakeizeKeys } from '../../types/case'
import { camelizeObject } from '../../utils'
import type { User } from '../../context/user-context'

import axios from 'axios'

export interface Comment {
  id: string
  user: User
  postId: string
  content: string
  image?: string
  createdAt: string
  updatedAt: string
}

type GetCommentsResponse = SnakeizeKeys<Comment>[]

export async function getComments(postId: string): Promise<Comment[]> {
  const { data } = await axios.get<GetCommentsResponse>(
    `/posts/${postId}/comments/`
  )
  const comments = data.map(camelizeObject)

  return comments
}
