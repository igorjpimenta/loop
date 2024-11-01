import { Badge } from '../../../components/ui/badge'
import type { Post } from '../../../http/get-posts'
import { formatRelativeTime } from '../../../utils'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-stone-800 hover:border-stone-700 p-4 transition-border duration-300 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center">
          <span className="font-medium leading-none">
            {post.username[0].toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col justify-between">
          <h3 className="font-medium text-stone-100">{post.username}</h3>

          <p className="text-sm text-stone-700">
            {formatRelativeTime(post.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {post.topics.map(({ id, name }) => (
            <Badge key={id}>{name}</Badge>
          ))}
        </div>

        <p>{post.content}</p>

        {post.image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt="Post content"
              className="max-w-full h-auto object-cover"
            />
          </div>
        )}
      </div>
    </article>
  )
}
