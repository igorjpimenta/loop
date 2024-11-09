import axios from 'axios'

export interface Topic {
  name: string
  id: string
}

export async function getTopics(): Promise<Topic[]> {
  const { data: topics } = await axios.get<Topic[]>('/topics/')

  return topics
}
