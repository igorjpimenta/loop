import { getPosts, type Post } from '../../http/get-posts'
import { Header } from './sections/header'
import { CreatePost } from './sections/create-post-form'
import { PostCard } from './components/post-card'

import { useQuery, useQueryClient } from '@tanstack/react-query'

export function Feed() {
  const queryClient = useQueryClient()

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
        <div className="animate-pulse text-sky-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 pb-6">
      <Header />

      <div className="flex flex-col gap-3 max-w-2xl mx-auto px-4">
        <CreatePost onPostCreated={handlePostCreated} />

        {posts && posts.length > 0 ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={() => handlePostDeleted(post.id)}
            />
          ))
        ) : (
          <div>No posts found</div>
        )}
      </div>
    </div>
  )
}
