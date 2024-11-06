import axios from 'axios'

export async function logUserOut(): Promise<void> {
  await axios.post('/api/logout/')
}
