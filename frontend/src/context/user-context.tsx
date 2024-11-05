import { registerUser, type RegisterUserProps } from '../http/register-user'
import {
  getAuthToken,
  type GetAuthTokenCredentials,
} from '../http/get-auth-token'

import { createContext, useContext, useState } from 'react'

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthenticatedUser extends Omit<User, 'email'> {
  access: string
  refresh: string
}

interface UserContextType {
  user: AuthenticatedUser | null
  setUser: (user: AuthenticatedUser | null) => void
  signup: (credentials: RegisterUserProps) => Promise<void>
  login: (credentials: GetAuthTokenCredentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const USER_STORAGE_KEY = '@Loop:user'

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  })

  const signup = async (data: RegisterUserProps) => {
    const userData = await registerUser(data)
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }

  const login = async (credentials: GetAuthTokenCredentials) => {
    const userData = await getAuthToken(credentials)
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  const isAuthenticated = !!user

  return (
    <UserContext.Provider
      value={{ user, setUser, signup, login, logout, isAuthenticated }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
