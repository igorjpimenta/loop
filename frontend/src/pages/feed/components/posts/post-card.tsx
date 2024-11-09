import { formatRelativeTime } from '../../../../utils'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Modal } from '../../../../components/ui/modal'
import { useUser } from '../../../../context/user-context'
import type { Post } from '../../../../http/posts/get-posts'
import { deletePost } from '../../../../http/posts/delete-post'
import { DeletePostModal } from '../../modals/delete-post-modal'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { PostActions } from './post-actions'
import { ImageModal } from '../../modals/image-modal'

interface PostCardProps {
  post: Post
  onDelete: () => void
}

export function PostCard({ post, onDelete }: PostCardProps) {
  enum ModalType {
    NONE = 0,
    DELETE = 1,
    IMAGE = 2,
  }

  const { isAuthenticated, user } = useUser()
  const [openModal, setOpenModal] = useState<ModalType>(ModalType.NONE)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      await deletePost(post.id)
      onDelete()
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal
      open={openModal !== ModalType.NONE}
      onOpenChange={() => setOpenModal(ModalType.NONE)}
    >
      <article className="group flex flex-col gap-3 rounded-xl border border-stone-800 hover:border-stone-700 p-4 transition-border duration-300 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center">
              <span className="font-medium leading-none">
                {post.user.username[0].toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col justify-between">
              <h3 className="font-medium text-stone-100">
                {post.user.username}
              </h3>

              <p className="text-sm text-stone-700">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>

          {isAuthenticated && user?.id === post.user.id && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={() => setOpenModal(ModalType.DELETE)}
                variant="secondary"
                shape="icon"
                icon={Trash2}
                disabled={isDeleting}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {post.topics.map(({ id, name }) => (
              <Badge key={id}>{name}</Badge>
            ))}
          </div>

          <p>{post.content}</p>

          {post.image && (
            <div className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenModal(ModalType.IMAGE)}
              >
                <img
                  src={post.image}
                  alt="Post content"
                  className="max-w-full max-h-[100vh] rounded-lg h-auto object-cover"
                />
              </button>
            </div>
          )}

          <PostActions post={post} />
        </div>
      </article>

      {openModal === ModalType.DELETE && (
        <DeletePostModal onSubmit={handleDelete} />
      )}

      {openModal === ModalType.IMAGE && post.image && (
        <ImageModal image={post.image} title="Post content" />
      )}
    </Modal>
  )
}
