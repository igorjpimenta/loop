import type { User } from '../context/user-context'

import axios from 'axios'

export interface RegisterUserProps {
  username: string
  password: string
  email: string
}

export async function registerUser({
  username,
  password,
  email,
}: RegisterUserProps): Promise<User> {
  const { data: user } = await axios.post<User>('/api/register/', {
    username,
    password,
    email,
  })

  return user
}
