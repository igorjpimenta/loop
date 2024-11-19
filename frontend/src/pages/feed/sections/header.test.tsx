import { useUser } from '../../../context/user-context'
import { Header } from './header'

import { render, screen, fireEvent } from '@testing-library/react'
import {
  afterEach,
  describe,
  test,
  expect,
  vi,
  type Mock,
  beforeEach,
} from 'vitest'

// Mock the useUser hook
vi.mock('../../../context/user-context', () => ({
  useUser: vi.fn(),
}))

describe('Header', () => {
  const mockHandleLogin = vi.fn()
  const mockHandleSignup = vi.fn()
  const mockHandleLogout = vi.fn()

  const mockUser = {
    handleSignup: mockHandleSignup,
    handleLogin: mockHandleLogin,
    handleLogout: mockHandleLogout,
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Non-authenticated', () => {
    beforeEach(() => {
      ;(useUser as Mock).mockReturnValue({
        ...mockUser,
        isAuthenticated: false,
      })

      render(<Header />)
    })

    describe('Rendering', () => {
      test('renders header with title and buttons when user is not authenticated', () => {
        expect(screen.getByText(/loop/i)).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /login/i })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: /sign up/i })
        ).toBeInTheDocument()
        expect(
          screen.queryByRole('button', { name: /logout/i })
        ).not.toBeInTheDocument()
      })
    })

    describe('Actions', () => {
      test('opens login modal when login button is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /login/i }))

        expect(
          screen.getByRole('heading', { name: /login/i })
        ).toBeInTheDocument()
      })

      test('opens signup modal when sign up button is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

        expect(
          screen.getByRole('heading', { name: /sign up/i })
        ).toBeInTheDocument()
      })
    })
  })

  describe('Authenticated', () => {
    beforeEach(() => {
      ;(useUser as Mock).mockReturnValue({ ...mockUser, isAuthenticated: true })

      render(<Header />)
    })

    describe('Rendering', () => {
      test('renders header with logout button when user is authenticated', () => {
        expect(
          screen.getByRole('button', { name: /logout/i })
        ).toBeInTheDocument()
        expect(
          screen.queryByRole('button', { name: /login/i })
        ).not.toBeInTheDocument()
        expect(
          screen.queryByRole('button', { name: /sign up/i })
        ).not.toBeInTheDocument()
      })
    })

    describe('Actions', () => {
      test('calls handleLogout when logout button is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /logout/i }))

        expect(mockHandleLogout).toHaveBeenCalled()
      })
    })
  })
})
