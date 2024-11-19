import { loginHttpScenarios } from '../../../test/scenarios'
import { Modal } from '../../../components/ui/modal'
import { LoginModal } from './login-modal'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

describe('LoginModal', () => {
  describe('Rendering', () => {
    test('renders modal with correct title and description', () => {
      // Test for default render
      render(
        <Modal open>
          <LoginModal onSubmit={vi.fn()} />
        </Modal>
      )

      expect(
        screen.getByRole('heading', { name: /login/i })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/login to your account to continue/i)
      ).toBeInTheDocument()
    })

    test('disables login button while loading', async () => {
      // Test for loading state
      const onSubmit = vi
        .fn()
        .mockResolvedValueOnce(loginHttpScenarios.loading())
      render(
        <Modal open>
          <LoginModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'validUser' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'validPassword' },
      })

      fireEvent.click(screen.getByRole('button', { name: /login/i }))
      expect(
        await screen.findByRole('button', { name: /logging in\.\.\./i })
      ).toBeDisabled()
    })
  })

  describe('Validation', () => {
    test('validates username and password fields', async () => {
      // Test for field validation
      render(
        <Modal open>
          <LoginModal onSubmit={vi.fn()} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'ab' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: '123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /login/i }))

      expect(await screen.findByText(/invalid username/i)).toBeInTheDocument()
      expect(await screen.findByText(/invalid password/i)).toBeInTheDocument()
    })

    test('displays invalid credentials error', async () => {
      const onSubmit = vi
        .fn()
        .mockRejectedValueOnce(loginHttpScenarios.invalidCredentials())
      render(
        <Modal open>
          <LoginModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'validUser' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'validPassword' },
      })

      fireEvent.click(screen.getByRole('button', { name: /login/i }))
      expect(
        await screen.findByText(/invalid credentials\./i)
      ).toBeInTheDocument()
    })

    test('displays internal server error', async () => {
      const onSubmit = vi
        .fn()
        .mockRejectedValueOnce(loginHttpScenarios.internalServerError())
      render(
        <Modal open>
          <LoginModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'validUser' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'validPassword' },
      })

      fireEvent.click(screen.getByRole('button', { name: /login/i }))
      expect(
        await screen.findByText(/an error occurred, try again later/i)
      ).toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    test('calls onSubmit with valid credentials', async () => {
      const onSubmit = vi.fn().mockResolvedValueOnce(undefined)
      render(
        <Modal open>
          <LoginModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'validUser' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'validPassword' },
      })

      fireEvent.click(screen.getByRole('button', { name: /login/i }))
      await waitFor(() =>
        expect(onSubmit).toHaveBeenCalledWith({
          username: 'validUser',
          password: 'validPassword',
        })
      )
    })
  })
})
