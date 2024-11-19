import { Textarea } from './textarea'

import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { userEvent } from '@testing-library/user-event'

describe('Textarea Component', () => {
  describe('Rendering', () => {
    test('renders with default props', () => {
      render(<Textarea placeholder="Type here..." />)
      const textarea = screen.getByPlaceholderText(/type here.../i)

      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveClass('bg-stone-900 min-h-24')
    })

    // Variant Tests
    test('renders with default variant', () => {
      // Test for default variant
      render(<Textarea variant="default" />)
      const textarea = screen.getByRole('textbox')

      expect(textarea).toHaveClass('bg-stone-900 rounded-lg overflow-hidden')
    })

    test('renders with transparent variant', () => {
      // Test for transparent variant
      render(<Textarea variant="transparent" />)
      const textarea = screen.getByRole('textbox')

      expect(textarea).toHaveClass(
        'bg-transparent rounded-none overflow-y-auto'
      )
    })

    test('renders with default height', () => {
      // Test for default height
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')

      expect(textarea).toHaveClass('min-h-24')
    })

    test('renders with sm height', () => {
      // Test for sm height
      render(<Textarea height="sm" />)
      const textarea = screen.getByRole('textbox')

      expect(textarea).toHaveClass('min-h-6')
    })
  })

  describe('Events', () => {
    // Behavior and Prop Combination Tests
    test('adjusts height on input', async () => {
      // Test for height adjustment on input
      render(<Textarea placeholder="Type here..." />)
      const textarea = screen.getByPlaceholderText(/type here.../i)

      // Simulate typing
      await userEvent.type(
        textarea,
        'This is a very long text that should increase the height of the textarea. Because it has so much text, it should be able to scroll. But at this point, I think that it should be enough text to see the scroll. So, I will stop typing.'
      )

      expect(textarea.style.height).toBe(`${textarea.scrollHeight}px`)
    }, 10000)
  })

  describe('Style Override', () => {
    // Style Override Tests
    test('applies custom className', () => {
      render(<Textarea className="custom-class" />)
      const textarea = screen.getByRole('textbox')

      expect(textarea).toHaveClass('custom-class')
      // Should still maintain base styles
      expect(textarea).toHaveClass('bg-stone-900 rounded-lg overflow-hidden')
    })

    // Accessibility Tests
    test('is accessible with aria-label', () => {
      render(<Textarea aria-label="Custom Textarea" />)
      const textarea = screen.getByLabelText(/custom textarea/i)

      expect(textarea).toBeInTheDocument()
    })
  })
})
