import { registerUser, type RegisterUserProps } from '../http/register-user'
import { logUserIn, type LogUserInCredentials } from '../http/log-user-in'
import { logUserOut } from '../http/log-user-out'

import { createContext, useContext, useState } from 'react'

export interface User {
  id: string
  username: string
  email: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  signup: (credentials: RegisterUserProps) => Promise<void>
  login: (credentials: LogUserInCredentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const USER_STORAGE_KEY = '@Loop:user'

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  })

  const signup = async (data: RegisterUserProps) => {
    const userData = await registerUser(data)
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }

  const login = async (credentials: LogUserInCredentials) => {
    const userData = await logUserIn(credentials)
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }

  const logout = async () => {
    await logUserOut()
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
