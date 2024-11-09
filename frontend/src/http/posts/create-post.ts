import type { CreatePostFormData } from '../../pages/feed/sections/create-post-form'
import type { SnakeizeKeys } from '../../types/case'
import { camelizeObject } from '../../utils'
import type { Post } from './get-posts'

import axios from 'axios'

interface CreatePostProps extends CreatePostFormData {
  userId: string
}

export async function createPost(formData: CreatePostProps): Promise<Post> {
  type CreatePostResponse = SnakeizeKeys<Post>

  const body = new FormData()

  body.append('user_id', formData.userId)
  body.append('content', formData.content)

  for (const topic of formData.topics) {
    body.append('topics_ids', topic)
  }

  if (formData.image) {
    body.append('image', formData.image)
  }

  const { data } = await axios.post<CreatePostResponse>('/posts/', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  const post = camelizeObject(data)

  return post
}
