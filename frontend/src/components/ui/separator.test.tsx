import { Separator } from './separator'

import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('Separator Component', () => {
  describe('Rendering', () => {
    // Basic Rendering Tests
    test('renders horizontal separator by default', () => {
      // Test for default orientation
      const { container } = render(<Separator />)
      const separator = container.firstChild as HTMLElement

      expect(separator).toHaveClass('h-px')
      expect(separator).toHaveClass('bg-stone-800')
    })

    test('renders vertical separator', () => {
      // Test for vertical orientation
      const { container } = render(<Separator orientation="vertical" />)
      const separator = container.firstChild as HTMLElement

      expect(separator).toHaveClass('w-px')
      expect(separator).toHaveClass('bg-stone-800')
    })

    // Style Override Tests
    test('applies custom className', () => {
      const { container } = render(<Separator className="custom-class" />)
      const separator = container.firstChild as HTMLElement

      expect(separator).toHaveClass('custom-class')
      expect(separator).toHaveClass('bg-stone-800') // Should maintain base styles
    })
  })
})
