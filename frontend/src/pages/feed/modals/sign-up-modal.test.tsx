import { registerHttpScenarios } from '../../../test/scenarios'
import { Modal } from '../../../components/ui/modal'
import { SignupModal } from './sign-up-modal'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'

describe('SignupModal', () => {
  describe('Rendering', () => {
    test('renders modal with correct title and description', () => {
      // Test for default render
      render(
        <Modal open>
          <SignupModal onSubmit={vi.fn()} />
        </Modal>
      )

      expect(
        screen.getByRole('heading', { name: /sign up/i })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/create an account to continue/i)
      ).toBeInTheDocument()
    })

    test('disables signup button while loading', async () => {
      const onSubmit = vi
        .fn()
        .mockResolvedValueOnce(registerHttpScenarios.loading())
      render(
        <Modal open>
          <SignupModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'validUser' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'validPassword' },
      })
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'valid@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
      expect(
        await screen.findByRole('button', { name: /signing up\.\.\./i })
      ).toBeDisabled()
    })
  })

  describe('Validation', () => {
    test('validates username, password, and email fields', async () => {
      render(
        <Modal open>
          <SignupModal onSubmit={vi.fn()} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'ab' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: '123' },
      })
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'invalidEmail' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      expect(await screen.findByText(/invalid username/i)).toBeInTheDocument()
      expect(await screen.findByText(/invalid password/i)).toBeInTheDocument()
      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
    })

    test('displays one of each error at the same time', async () => {
      const onSubmit = vi
        .fn()
        .mockRejectedValueOnce(registerHttpScenarios.oneOfEach())
      render(
        <Modal open>
          <SignupModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'takenUser' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: '1234abcd' },
      })
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'taken@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
      expect(
        await screen.findByText(/user with this username already exists/i)
      ).toBeInTheDocument()
      expect(
        await screen.findByText(/user with this email already exists/i)
      ).toBeInTheDocument()
      expect(
        await screen.findByText(/this password is too common/i)
      ).toBeInTheDocument()
    })

    test('displays internal server error', async () => {
      const onSubmit = vi
        .fn()
        .mockRejectedValueOnce(registerHttpScenarios.internalServerError())
      render(
        <Modal open>
          <SignupModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'validUser' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'validPassword' },
      })
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'valid@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
      expect(
        await screen.findByText(/an error occurred, try again later/i)
      ).toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    test('calls onSignup with valid data', async () => {
      const onSubmit = vi.fn().mockResolvedValueOnce(undefined)
      render(
        <Modal open>
          <SignupModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'validUser' },
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'validPassword' },
      })
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'valid@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
      await waitFor(() =>
        expect(onSubmit).toHaveBeenCalledWith({
          username: 'validUser',
          password: 'validPassword',
          email: 'valid@example.com',
        })
      )
    })
  })
})
