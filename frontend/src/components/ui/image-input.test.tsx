import { ImageInput } from './image-input'

import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('ImageInput Component', () => {
  describe('Rendering', () => {
    test('renders with default props', () => {
      render(<ImageInput />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()

      expect(button).toHaveClass('bg-transparent')
      expect(button).toHaveAttribute('type', 'button')
    })

    // Variant Tests
    test('renders with disabled state', () => {
      render(<ImageInput disabled />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Events', () => {
    test('calls onChange when a file is selected', () => {
      // Test for onChange when a file is selected
      const handleChange = vi.fn()
      render(<ImageInput onChange={handleChange} />)

      const input = screen.getByTestId('image-input')
      const button = screen.getByRole('button')
      const file = new File(['dummy content'], 'example.png', {
        type: 'image/png',
      })

      fireEvent.click(button)
      fireEvent.change(input, { target: { files: [file] } })

      expect(handleChange).toHaveBeenCalledWith(file)

      const calledFile = handleChange.mock.calls[0][0]
      expect(calledFile.name).toBe('example.png')
      expect(calledFile.type).toBe('image/png')
    })

    test('does not call onChange when no file is selected', () => {
      // Test for onChange when no file is selected
      const handleChange = vi.fn()
      render(<ImageInput onChange={handleChange} />)

      const input = screen.getByTestId('image-input')
      const button = screen.getByRole('button')

      fireEvent.click(button)
      fireEvent.change(input, { target: { files: [] } }) // Simulate no file selected

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Style Override', () => {
    test('allows style overrides through className', () => {
      render(<ImageInput className="custom-class" />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      // Should still maintain base styles
      expect(button).toHaveClass('bg-transparent')
      expect(button).toHaveClass('enabled:hover:text-stone-400')
    })

    // Accessibility Tests
    test('passes through additional props', () => {
      // Test for aria-label and title
      const { rerender } = render(
        <ImageInput aria-label="image-upload" title="Upload an image" />
      )

      const input = screen.getByLabelText(/image-upload/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('title', 'Upload an image')

      // Test for sr-only label
      rerender(<ImageInput />)

      const label = screen.getByText(/choose image/i)
      expect(label).toBeInTheDocument()
      expect(label).toHaveClass('sr-only')
    })
  })
})
