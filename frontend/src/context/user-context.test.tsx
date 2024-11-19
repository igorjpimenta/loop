import { type User, UserProvider, useUser } from './user-context'
import { register, type RegisterProps } from '../http/users/register'
import { login, type LoginCredentials } from '../http/users/login'
import { logout } from '../http/users/logout'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest'

// Mock the HTTP functions
vi.mock('../http/users/register', () => ({
  register: vi.fn(),
}))
vi.mock('../http/users/login', () => ({
  login: vi.fn(),
}))
vi.mock('../http/users/logout', () => ({
  logout: vi.fn(),
}))

describe('UserContext', () => {
  const TestComponent = () => {
    const { user, handleSignup, handleLogin, handleLogout, isAuthenticated } =
      useUser()
    return (
      <div>
        <div data-testid="user">{JSON.stringify(user)}</div>
        <div data-testid="is-authenticated">
          {isAuthenticated ? 'true' : 'false'}
        </div>
        <button
          type="button"
          onClick={() =>
            handleSignup({
              username: 'test',
              password: 'test',
            } as RegisterProps)
          }
        >
          Signup
        </button>
        <button
          type="button"
          onClick={() =>
            handleLogin({
              username: 'test',
              password: 'test',
            } as LoginCredentials)
          }
        >
          Login
        </button>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )
  }
  const mockUser: User = {
    id: 'user1',
    username: 'JohnDoe',
    email: 'john@doe.com',
  }

  beforeEach(() => {
    localStorage.clear()
  })

  test('initializes user state from local storage', () => {
    localStorage.setItem('@Loop:user', JSON.stringify(mockUser))

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    expect(screen.getByTestId('user')).toHaveTextContent(
      JSON.stringify(mockUser)
    )
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
  })

  test('handles signup correctly', async () => {
    ;(register as Mock).mockResolvedValueOnce(mockUser)

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      )
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
      expect(localStorage.getItem('@Loop:user')).toEqual(
        JSON.stringify(mockUser)
      )
    })
  })

  test('handles login correctly', async () => {
    ;(login as Mock).mockResolvedValueOnce(mockUser)

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      )
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
      expect(localStorage.getItem('@Loop:user')).toEqual(
        JSON.stringify(mockUser)
      )
    })
  })

  test('handles logout correctly', async () => {
    ;(logout as Mock).mockResolvedValueOnce(undefined)
    localStorage.setItem('@Loop:user', JSON.stringify(mockUser))

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
      expect(localStorage.getItem('@Loop:user')).toBeNull()
    })
  })
})
