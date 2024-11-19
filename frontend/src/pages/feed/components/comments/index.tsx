import { useUser } from '../../../../context/user-context'
import {
  getComments,
  type Comment,
} from '../../../../http/post-actions/get-comments'
import { CreateCommentForm } from './create-comment-form'
import { CommentCard } from './comment-card'

import { useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

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
  const queryClient = useQueryClient()
  const { isAuthenticated } = useUser()

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    staleTime: 1000 * 60 * 5,
  })

  const handleCommentCreated = (comment: Comment) => {
    queryClient.setQueryData(
      ['comments', postId],
      (prevComments: Comment[]) => [comment, ...prevComments]
    )
    onCommentCreated()
  }

  const handleCommentDeleted = (commentId: string) => {
    queryClient.setQueryData(['comments', postId], (prevComments: Comment[]) =>
      prevComments.filter(comment => comment.id !== commentId)
    )
    onCommentDeleted()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-pulse text-stone-300">Loading...</div>
      </div>
    )
  }

  return (
    <div data-testid="comments" className="flex flex-col gap-4">
      {isAuthenticated && (
        <CreateCommentForm
          postId={postId}
          onCommentCreated={handleCommentCreated}
        />
      )}

      {comments && comments.length > 0 && (
        <div data-testid="comments-list" className="flex flex-col gap-6">
          {comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDelete={() => handleCommentDeleted(comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
