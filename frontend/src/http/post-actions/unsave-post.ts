import axios from 'axios'

export async function unsavePost(id: string) {
  await axios.delete(`/posts/${id}/save/`)
}
