import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalTrigger,
  ModalClose,
} from './modal'

import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

describe('Modal Component', () => {
  describe('Rendering', () => {
    test('renders with default props', () => {
      render(
        <Modal open>
          <ModalContent>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      const title = screen.getByText(/modal title/i)
      const description = screen.getByText(/modal description/i)
      const closeButton = screen.getByTestId('close-modal')

      expect(title).toBeInTheDocument()
      expect(description).toBeInTheDocument()
      expect(closeButton).toBeInTheDocument()
    })

    test('miss close button', () => {
      // Test for missing close button in a modal that allow pointer down outside
      const handleClose = vi.fn()
      render(
        <Modal open onOpenChange={handleClose}>
          <ModalContent allowPointerDownOutside={true}>
            <ModalTitle>Modal Without Close Button</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      expect(screen.queryByTestId('close-modal')).toBeNull()
    })

    test('have close button in a modal that allow pointer down outside', () => {
      // Test for having close button in a modal that allow pointer down outside
      const handleClose = vi.fn()
      render(
        <Modal open onOpenChange={handleClose}>
          <ModalContent allowPointerDownOutside={true}>
            <ModalTitle>Modal With Close Button</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
            <ModalClose />
          </ModalContent>
        </Modal>
      )

      expect(screen.queryByTestId('close-modal')).toBeInTheDocument()
    })
  })

  describe('Events', () => {
    test('handles open using trigger', () => {
      // Test for open using trigger
      const handleClose = vi.fn()
      render(
        <Modal onOpenChange={handleClose}>
          <ModalTrigger />
          <ModalContent>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      fireEvent.click(screen.getByTestId('modal-trigger'))
      expect(handleClose).toHaveBeenCalled()
    })
    test('handles close button functionality', () => {
      // Test for close button functionality
      const handleClose = vi.fn()
      render(
        <Modal open onOpenChange={handleClose}>
          <ModalContent>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      fireEvent.click(screen.getByTestId('close-modal'))
      expect(handleClose).toHaveBeenCalled()
    })

    test('does not close when clicking outside the modal', async () => {
      // Test for default behavior of not closing when clicking outside the modal
      const handleClose = vi.fn()
      render(
        <Modal open onOpenChange={handleClose}>
          <ModalContent>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      const overlay = screen.getByTestId('modal-overlay')
      await userEvent.click(overlay)
      expect(handleClose).not.toHaveBeenCalled()
    })

    test('closes when clicking outside the modal', async () => {
      // Test for behavior of closing when clicking outside the modal
      const handleClose = vi.fn()
      render(
        <Modal open onOpenChange={handleClose}>
          <ModalContent allowPointerDownOutside={true}>
            <ModalTitle>Modal Without Close Button</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      const overlay = screen.getByTestId('modal-overlay')

      await userEvent.click(overlay)
      expect(handleClose).toHaveBeenCalled()
    })

    test('closes modal when escape key is pressed', () => {
      // Test for behavior of closing when escape key is pressed
      const handleClose = vi.fn()
      render(
        <Modal open onOpenChange={handleClose}>
          <ModalContent>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(handleClose).toHaveBeenCalled()
    })
  })

  describe('Style Override', () => {
    test('applies custom styles through className', () => {
      render(
        <Modal open>
          <ModalContent className="bg-red-500">
            <ModalTitle>Styled Modal</ModalTitle>
            <ModalDescription>Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('bg-red-500')
      // Should still maintain base styles
      expect(modal).toHaveClass('rounded-xl')
    })

    // Accessibility Tests
    test('is accessible with aria-label', () => {
      render(
        <Modal open>
          <ModalContent aria-label="Custom Modal">
            <ModalTitle>Accessible Modal</ModalTitle>
            <ModalDescription>Accessible Modal Description</ModalDescription>
          </ModalContent>
        </Modal>
      )

      const modal = screen.getByLabelText(/custom modal/i)
      expect(modal).toBeInTheDocument()
    })
  })
})
