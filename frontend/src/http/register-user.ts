import { API_URL } from '../lib/config'
import type { AuthenticatedUser } from '../context/user-context'

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
}: RegisterUserProps): Promise<AuthenticatedUser> {
  const { data: user } = await axios.post<AuthenticatedUser>(
    `${API_URL}/api/register/`,
    {
      username,
      password,
      email,
    }
  )

  return user
}
