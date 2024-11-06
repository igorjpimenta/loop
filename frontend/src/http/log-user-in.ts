import type { User } from '../context/user-context'

import axios from 'axios'

export interface LogUserInCredentials {
  username: string
  password: string
}

export async function logUserIn({
  username,
  password,
}: LogUserInCredentials): Promise<User> {
  const { data: user } = await axios.post<User>('/api/login/', {
    username,
    password,
  })

  return user
}
