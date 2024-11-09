import axios from 'axios'

interface DeleteCommentProps {
  postId: string
  commentId: string
}

export async function deleteComment({ postId, commentId }: DeleteCommentProps) {
  await axios.delete(`/posts/${postId}/comments/${commentId}/`)
}
