import axios from 'axios'

export async function downvotePost(id: string) {
  await axios.post(`/posts/${id}/downvote/`)
}
