import { register, type RegisterProps } from '../http/users/register'
import { login, type LoginCredentials } from '../http/users/login'
import { logout } from '../http/users/logout'

import { createContext, useContext, useState } from 'react'

export interface User {
  id: string
  username: string
  email: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  handleSignup: (credentials: RegisterProps) => Promise<void>
  handleLogin: (credentials: LoginCredentials) => Promise<void>
  handleLogout: () => Promise<void>
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

  const handleSignup = async (data: RegisterProps) => {
    const userData = await register(data)
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    const userData = await login(credentials)
    setUser(userData)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  const isAuthenticated = !!user

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        handleSignup,
        handleLogin,
        handleLogout,
        isAuthenticated,
      }}
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
