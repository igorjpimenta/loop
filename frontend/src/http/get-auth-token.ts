import { API_URL } from '../lib/config'
import type { AuthenticatedUser } from '../context/user-context'

import axios from 'axios'

export interface GetAuthTokenCredentials {
  username: string
  password: string
}

export async function getAuthToken({
  username,
  password,
}: GetAuthTokenCredentials): Promise<AuthenticatedUser> {
  const { data: user } = await axios.post<AuthenticatedUser>(
    `${API_URL}/api/token/`,
    {
      username,
      password,
    }
  )

  return user
}
