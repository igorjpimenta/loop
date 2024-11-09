import axios from 'axios'

export async function savePost(id: string) {
  await axios.post(`/posts/${id}/save/`)
}
