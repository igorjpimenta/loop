import type { User } from '../../context/user-context'

import axios from 'axios'

export interface LoginCredentials {
  username: string
  password: string
}

export async function login({
  username,
  password,
}: LoginCredentials): Promise<User> {
  const { data: user } = await axios.post<User>('/login/', {
    username,
    password,
  })

  return user
}
