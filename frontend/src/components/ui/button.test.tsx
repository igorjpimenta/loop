import { Button } from './button'

import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { Mail, User } from 'lucide-react'

describe('Button Component', () => {
  describe('Rendering', () => {
    test('renders with default props', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-orange-500')
      expect(button).toHaveAttribute('type', 'button')
    })

    // Variant Tests
    test('renders different variants correctly', () => {
      // Test primary variant
      const { rerender } = render(<Button variant="primary">Primary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-orange-500')

      // Test secondary variant
      rerender(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-stone-900')

      // Test danger variant
      rerender(<Button variant="danger">Danger</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-red-500')
    })

    test('renders different sizes correctly', () => {
      // Test small size
      const { rerender } = render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-sm')

      // Test medium size
      rerender(<Button size="md">Medium</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-base')

      // Test large size
      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-lg')
    })

    test('renders different shapes correctly', () => {
      // Icon Shape Tests
      const { rerender } = render(
        <Button shape="icon" icon={User}>
          Profile
        </Button>
      )
      const button = screen.getByRole('button')

      expect(button.querySelector('svg')).toBeInTheDocument()
      expect(screen.queryByText(/profile/i)).not.toBeInTheDocument()

      // Link Shape Tests
      rerender(
        <Button shape="link" icon={User}>
          Profile
        </Button>
      )
      expect(button.querySelector('svg')).toBeInTheDocument()
      expect(screen.queryByText(/profile/i)).toBeInTheDocument()

      // Default Shape Tests
      rerender(<Button icon={User}>Profile</Button>)
      expect(button.querySelector('svg')).toBeInTheDocument()
      expect(screen.queryByText(/profile/i)).toBeInTheDocument()

      // Text Shape Tests
      rerender(<Button shape="link">Profile</Button>)
      expect(button.querySelector('svg')).not.toBeInTheDocument()
      expect(screen.queryByText(/profile/i)).toBeInTheDocument()
    })

    test('renders filled icon correctly', () => {
      // Filled Icon Tests
      const { rerender } = render(
        <Button icon={User} filled>
          Filled Icon
        </Button>
      )
      const icon = screen.getByRole('button').querySelector('svg')
      expect(icon).toHaveClass('fill-current')

      // Unfilled Icon Tests
      rerender(<Button icon={User}>Unfilled Icon</Button>)
      expect(icon).not.toHaveClass('fill-current')
    })

    // Prop Combination Tests
    test('renders icon button correctly', () => {
      render(<Button shape="icon" icon={Mail} />)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('p-1')
      expect(button.querySelector('svg')).toBeInTheDocument()
    })

    // Loading State Tests
    test('renders loading state correctly', () => {
      render(
        <Button isLoading icon={Mail}>
          Loading
        </Button>
      )
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button').querySelector('.animate-spin')
      ).toBeInTheDocument()
      expect(screen.queryByTestId('standard-icon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('loading-icon')).toBeInTheDocument()
    })

    // Accessibility Tests
    test('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Events', () => {
    test('handles click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})
