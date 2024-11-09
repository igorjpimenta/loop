import axios from 'axios'

export async function upvotePost(id: string) {
  await axios.post(`/posts/${id}/upvote/`)
}
