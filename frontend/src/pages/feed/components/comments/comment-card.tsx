import { formatRelativeTime } from '../../../../utils'
import { Button } from '../../../../components/ui/button'
import { Image } from '../../../../components/ui/image'
import { useUser } from '../../../../context/user-context'
import { deleteComment } from '../../../../http/post-actions/delete-comment'
import type { Comment } from '../../../../http/post-actions/get-comments'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface CommentCardProps {
  comment: Comment
  onDelete: () => void
}

export function CommentCard({ comment, onDelete }: CommentCardProps) {
  const { isAuthenticated, user } = useUser()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      await deleteComment({ commentId: comment.id, postId: comment.postId })
      onDelete()
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center">
            <span className="text-sm font-medium leading-none">
              {comment.user.username[0].toUpperCase()}
            </span>
          </div>

          <h3 className="font-medium text-stone-100">
            {comment.user.username}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <p className="text-sm text-stone-700">
            {formatRelativeTime(comment.createdAt)}
          </p>

          {isAuthenticated && user?.id === comment.user.id && (
            <Button
              data-testid="delete-comment-button"
              variant="secondary"
              shape="icon"
              icon={Trash2}
              onClick={handleDelete}
              disabled={isDeleting}
            />
          )}
        </div>
      </div>

      <p>{comment.content}</p>

      {comment.image && (
        <Image src={comment.image} kind="preview" deletable={false} />
      )}
    </div>
  )
}
