import { httpScenarios } from '../../../test/scenarios'
import { Modal } from '../../../components/ui/modal'
import { DeletePostModal } from './delete-post-modal'

import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'

describe('DeletePostModal', () => {
  describe('Rendering', () => {
    test('renders modal with correct title and description', () => {
      render(
        <Modal open>
          <DeletePostModal onSubmit={vi.fn()} />
        </Modal>
      )

      expect(
        screen.getByRole('heading', { name: /delete post\?/i })
      ).toBeInTheDocument()
      expect(
        screen.getByText(/this action can't be undone/i)
      ).toBeInTheDocument()
    })

    test('disables delete button while loading', async () => {
      const onSubmit = vi.fn().mockResolvedValueOnce(httpScenarios.loading())
      render(
        <Modal open>
          <DeletePostModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.click(screen.getByRole('button', { name: /delete/i }))
      expect(
        await screen.findByRole('button', { name: /deleting\.\.\./i })
      ).toBeDisabled()
    })
  })

  describe('Validation', () => {
    test('displays internal server error', async () => {
      const onSubmit = vi
        .fn()
        .mockRejectedValueOnce(httpScenarios.internalServerError())
      render(
        <Modal open>
          <DeletePostModal onSubmit={onSubmit} />
        </Modal>
      )

      fireEvent.click(screen.getByRole('button', { name: /delete/i }))
      expect(
        await screen.findByText(/an error occurred, try again later/i)
      ).toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    test('calls onSubmit when delete button is clicked', async () => {
      const onSubmit = vi.fn().mockResolvedValueOnce(undefined)

      render(
        <Modal open>
          <DeletePostModal onSubmit={onSubmit} />
        </Modal>
      )

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /delete/i }))
      })
      expect(onSubmit).toHaveBeenCalled()
    })
  })
})
