import { getPosts, type Post } from '../../../../http/posts/get-posts'
import { useUser } from '../../../../context/user-context'
import { CreatePost } from './create-post-form'
import { PostCard } from './post-card'

import { useQuery, useQueryClient } from '@tanstack/react-query'

export function Posts() {
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useUser()

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 1000 * 60 * 5,
  })

  const handlePostCreated = (newPost: Post) => {
    queryClient.setQueryData(['posts'], (prevPosts: Post[]) => [
      newPost,
      ...prevPosts,
    ])
  }

  const handlePostDeleted = async (postId: string) => {
    queryClient.setQueryData(['posts'], (prevPosts: Post[]) =>
      prevPosts.filter(post => post.id !== postId)
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-stone-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto px-4">
      {isAuthenticated && user?.id && (
        <CreatePost userId={user.id} onPostCreated={handlePostCreated} />
      )}

      {posts && posts.length > 0 ? (
        <div data-testid="posts-list" className="flex flex-col gap-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={() => handlePostDeleted(post.id)}
            />
          ))}
        </div>
      ) : (
        <div>No posts found</div>
      )}
    </div>
  )
}
