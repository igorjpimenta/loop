import { Input } from './input'

import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('Input Component', () => {
  describe('Rendering', () => {
    test('renders with default props', () => {
      render(<Input placeholder="Enter text" />)

      const input = screen.getByPlaceholderText(/enter text/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('bg-stone-900')
      expect(input).toHaveClass('border-stone-800')
    })

    // Variant Tests
    test('renders with different types', () => {
      render(<Input type="password" placeholder="Enter password" />)

      const input = screen.getByPlaceholderText(/enter password/i)
      expect(input).toHaveAttribute('type', 'password')
    })
  })

  describe('Events', () => {
    test('handles value changes with defaultValue', () => {
      // Test for value change
      const { rerender } = render(<Input defaultValue="initial" />)
      const input = screen.getByDisplayValue(/initial/i)

      fireEvent.change(input, { target: { value: 'updated' } })
      expect(input).toHaveValue('updated')

      // Test for ref forwarding
      const ref = { current: null }
      rerender(<Input ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    test('handles disabled state', () => {
      // Test for disabled state
      render(<Input disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    test('handles focus states', () => {
      // Test for focus state
      render(<Input />)
      const input = screen.getByRole('textbox')

      input.focus()
      expect(document.activeElement).toBe(input)

      input.blur()
      expect(document.activeElement).not.toBe(input)
    })
  })

  describe('Props Override', () => {
    test('renders with a maxLength attribute', () => {
      // Test for maxLength attribute
      render(<Input maxLength={10} placeholder="Max length 10" />)
      const input = screen.getByPlaceholderText(/max length 10/i)
      expect(input).toHaveAttribute('maxLength', '10')
    })

    test('renders with a readOnly state', () => {
      // Test for readOnly state
      render(<Input readOnly defaultValue="Read only" />)
      const input = screen.getByDisplayValue(/read only/i)
      expect(input).toHaveAttribute('readonly')
    })

    // Style Override Tests
    test('applies custom className', () => {
      render(<Input className="custom-class" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-class')
      // Should still maintain base styles
      expect(input).toHaveClass('bg-stone-900 border-stone-800')
    })

    // Accessibility Tests
    test('passes through additional props', () => {
      render(<Input aria-label="input-label" title="Input Title" />)

      const input = screen.getByLabelText(/input-label/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('title', 'Input Title')
    })
  })
})
