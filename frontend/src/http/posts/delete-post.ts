import axios from 'axios'

export async function deletePost(id: string) {
  await axios.delete(`/posts/${id}/`)
}
