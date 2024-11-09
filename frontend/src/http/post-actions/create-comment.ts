import type { CreateCommentFormData } from '../../pages/feed/components/comments/create-comment-form'
import type { SnakeizeKeys } from '../../types/case'
import { camelizeObject } from '../../utils'
import type { Comment } from './get-comments'

import axios from 'axios'

interface CreateCommentProps extends CreateCommentFormData {
  postId: string
}

export async function createComment({
  postId,
  ...formData
}: CreateCommentProps): Promise<Comment> {
  type CreateCommentResponse = SnakeizeKeys<Comment>

  const body = new FormData()

  body.append('content', formData.content)

  if (formData.image) {
    body.append('image', formData.image)
  }

  const { data } = await axios.post<CreateCommentResponse>(
    `/posts/${postId}/comments/`,
    body,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  const comment = camelizeObject(data)

  return comment
}
