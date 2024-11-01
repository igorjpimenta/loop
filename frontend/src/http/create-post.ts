import { API_URL } from '../lib/config'
import type { CreatePostFormData } from '../pages/feed/forms/create-post'
import type { Post } from './get-posts'

import axios from 'axios'

export async function createPost(formData: CreatePostFormData): Promise<Post> {
  const body = new FormData()

  body.append('username', 'sarah_dev')
  body.append('content', formData.content)

  for (const topic of formData.topics) {
    body.append('topics_ids', topic)
  }

  if (formData.image) {
    body.append('image', formData.image)
  }

  const { data: response } = await axios.post<Post>(
    `${API_URL}/api/posts/`,
    body,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response
}
