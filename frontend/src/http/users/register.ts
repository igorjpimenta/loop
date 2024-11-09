import type { User } from '../../context/user-context'

import axios from 'axios'

export interface RegisterProps {
  username: string
  password: string
  email: string
}

export async function register({
  username,
  password,
  email,
}: RegisterProps): Promise<User> {
  const { data: user } = await axios.post<User>('/register/', {
    username,
    password,
    email,
  })

  return user
}
