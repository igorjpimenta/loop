import {
  getComments,
  type Comment,
} from '../../../../http/post-actions/get-comments'
import { CreateCommentForm } from './create-comment-form'
import { CommentCard } from './comment-card'

import { useEffect, useState } from 'react'

interface CommentsProps {
  postId: string
  onCommentCreated: () => void
  onCommentDeleted: () => void
}

export function Comments({
  postId,
  onCommentCreated,
  onCommentDeleted,
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    async function loadComments() {
      const fetchedComments = await getComments(postId)
      setComments(fetchedComments)
    }

    loadComments()
  }, [postId])

  const handleCommentCreated = (comment: Comment) => {
    setComments(prevComments => [comment, ...prevComments])
    onCommentCreated()
  }

  const handleCommentDeleted = (commentId: string) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    )
    onCommentDeleted()
  }

  return (
    <div className="flex flex-col gap-4">
      <CreateCommentForm
        postId={postId}
        onCommentCreated={handleCommentCreated}
      />

      <div className="flex flex-col gap-6">
        {comments.map(comment => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDelete={handleCommentDeleted}
          />
        ))}
      </div>
    </div>
  )
}
