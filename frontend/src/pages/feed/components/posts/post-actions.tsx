import { Separator } from '../../../../components/ui/separator'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { useUser } from '../../../../context/user-context'
import type { Post } from '../../../../http/posts/get-posts'
import { savePost } from '../../../../http/post-actions/save-post'
import { unsavePost } from '../../../../http/post-actions/unsave-post'
import { upvotePost } from '../../../../http/post-actions/upvote-post'
import { downvotePost } from '../../../../http/post-actions/downvote-post'
import { Comments } from '../comments'

import { useState } from 'react'
import { ArrowBigUp, Bookmark, MessageSquare } from 'lucide-react'

type PostActions = Post['actions']

interface PostActionsProps {
  post: Post
}

export function PostActions({ post }: PostActionsProps) {
  const { isAuthenticated, user } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [postActions, setPostActions] = useState<PostActions>(post.actions)

  const handleSave = async () => {
    try {
      setIsSaving(true)

      await savePost(post.id)
      setPostActions(prev => ({ ...prev, isSaved: true }))
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnsave = async () => {
    try {
      setIsSaving(true)

      await unsavePost(post.id)
      setPostActions(prev => ({ ...prev, isSaved: false }))
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpvote = async () => {
    try {
      await upvotePost(post.id)

      setPostActions(prev => {
        const isDownvoted = false
        const isUpvoted = !prev.isUpvoted
        const votes =
          prev.votes + (isUpvoted ? 1 : -1) + (prev.isDownvoted ? 1 : 0)

        return { ...prev, isUpvoted, isDownvoted, votes }
      })
    } catch (error) {
      console.error('Error upvoting post:', error)
    }
  }

  const handleDownvote = async () => {
    try {
      await downvotePost(post.id)

      setPostActions(prev => {
        const isDownvoted = !prev.isDownvoted
        const isUpvoted = false
        const votes =
          prev.votes + (isDownvoted ? -1 : 1) + (prev.isUpvoted ? -1 : 0)

        return { ...prev, isUpvoted, isDownvoted, votes }
      })
    } catch (error) {
      console.error('Error downvoting post:', error)
    }
  }

  const handleOpenComments = () => {
    setIsCommentsOpen(true)
  }

  const handleCommentCreated = () => {
    setPostActions(prev => ({ ...prev, comments: prev.comments + 1 }))
  }

  const handleCommentDeleted = () => {
    setPostActions(prev => ({ ...prev, comments: prev.comments - 1 }))
  }

  return (
    <>
      {isAuthenticated && (
        <div className="flex justify-start items-end gap-4">
          <Badge className="flex items-center gap-2">
            <Button
              className="p-0"
              onClick={handleUpvote}
              variant="secondary"
              shape="icon"
              icon={ArrowBigUp}
              filled={postActions.isUpvoted}
            />

            <span className="text-sm font-medium w-5 text-center">
              {postActions.votes}
            </span>

            <Button
              className="rotate-180 p-0"
              onClick={handleDownvote}
              variant="secondary"
              shape="icon"
              icon={ArrowBigUp}
              filled={postActions.isDownvoted}
            />
          </Badge>

          <Badge className="flex items-center gap-2">
            <Button
              className="p-0"
              onClick={handleOpenComments}
              variant="secondary"
              shape="icon"
              icon={MessageSquare}
            >
              <span className="text-sm font-medium w-5 text-center">
                {postActions.comments}
              </span>
            </Button>
          </Badge>

          <Badge className="flex items-center gap-2">
            <Button
              className="p-0"
              onClick={postActions.isSaved ? handleUnsave : handleSave}
              variant="secondary"
              shape="icon"
              icon={Bookmark}
              filled={postActions.isSaved}
              disabled={isSaving}
            >
              <span className="text-sm font-medium text-center">Save</span>
            </Button>
          </Badge>
        </div>
      )}

      {isAuthenticated && user?.id && isCommentsOpen && (
        <>
          <Separator />

          <Comments
            onCommentCreated={handleCommentCreated}
            onCommentDeleted={handleCommentDeleted}
            postId={post.id}
          />
        </>
      )}
    </>
  )
}
