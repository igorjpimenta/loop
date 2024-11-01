import { API_URL } from '../lib/config'

import axios from 'axios'

export async function deletePost(id: string) {
  await axios.delete(`${API_URL}/api/posts/${id}/`)
}
