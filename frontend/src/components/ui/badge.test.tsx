import { Badge } from './badge'

import { test, expect, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('Badge Component', () => {
  describe('Rendering', () => {
    // Basic rendering tests
    test('renders with default props', () => {
      render(<Badge>Default Badge</Badge>)
      const badgeElement = screen.getByRole('note')

      expect(badgeElement).toHaveTextContent(/default badge/i)
      expect(badgeElement).toHaveAttribute('data-uniform', 'true')
      expect(badgeElement).toHaveAttribute('data-highlighted', 'false')
      expect(badgeElement).toHaveClass('bg-stone-900')
    })

    // Variant tests
    test('renders with outlined state', () => {
      render(<Badge state="outlined">Outlined Badge</Badge>)
      const badgeElement = screen.getByRole('note')

      expect(badgeElement).toHaveTextContent(/outlined badge/i)
      expect(badgeElement).toHaveClass('border-dashed')
      expect(badgeElement).toHaveClass('border-stone-700')
    })

    test('renders with filled state', () => {
      render(<Badge state="filled">Filled Badge</Badge>)
      const badgeElement = screen.getByRole('note')

      expect(badgeElement).toHaveTextContent(/filled badge/i)
      expect(badgeElement).toHaveClass('bg-stone-900')
      expect(badgeElement).toHaveClass('text-stone-300')
    })

    // Prop combination tests
    test('renders with highlighted and non-uniform props', () => {
      render(
        <Badge highlighted uniform={false} state="outlined">
          Interactive Badge
        </Badge>
      )
      const badgeElement = screen.getByRole('note')

      expect(badgeElement).toHaveTextContent(/interactive badge/i)
      expect(badgeElement).toHaveAttribute('data-uniform', 'false')
      expect(badgeElement).toHaveAttribute('data-highlighted', 'true')
      expect(badgeElement).toHaveClass('border-dashed')
    })
  })

  describe('Style override', () => {
    // Style override tests
    test('allows style overrides through className', () => {
      render(
        <Badge className="custom-class bg-red-500">Custom Styled Badge</Badge>
      )
      const badgeElement = screen.getByRole('note')

      expect(badgeElement).toHaveTextContent(/custom styled badge/i)
      expect(badgeElement).toHaveClass('custom-class')
      expect(badgeElement).toHaveClass('bg-red-500')
      // Should still maintain base styles
      expect(badgeElement).toHaveClass('px-2.5')
      expect(badgeElement).toHaveClass('py-0.5')
    })

    // Accessibility tests
    test('passes through additional props', () => {
      render(
        <Badge aria-label="status" title="Status Badge">
          Status
        </Badge>
      )
      const badgeElement = screen.getByRole('note', { name: /status/i })

      expect(badgeElement).toBeInTheDocument()
      expect(badgeElement).toHaveAttribute('title', 'Status Badge')
    })
  })
})
