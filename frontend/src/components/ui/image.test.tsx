import { Image } from './image'

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('Image Component', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'mock-url')
  })

  describe('Rendering', () => {
    test('renders nothing when no image is provided', () => {
      const { container } = render(<Image src={undefined} />)
      expect(container).toBeEmptyDOMElement()
    })

    test('renders image from string URL', () => {
      render(<Image src="test-image.jpg" />)
      const img = screen.getByTestId('image-preview')
      expect(img).toHaveAttribute('src', 'test-image.jpg')
    })

    test('renders image from File object', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      render(<Image src={file} />)

      const img = screen.getByTestId('image-preview')
      expect(img).toHaveAttribute('src', 'mock-url')
      expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    })

    // Variant Tests
    test('renders with default variant', () => {
      render(<Image src="test.jpg" />)
      const img = screen.getByTestId('image-preview')
      expect(img).toHaveClass(
        'max-w-full max-h-[100vh] rounded-lg h-auto object-cover'
      )
    })

    test('renders with preview variant', () => {
      render(<Image src="test.jpg" kind="preview" />)
      const img = screen.getByTestId('image-preview')
      expect(img).toHaveClass('max-w-44 max-h-44 rounded-lg object-cover')
    })
  })

  describe('Validation', () => {
    test('shows delete button when deletable is true', () => {
      const handleDelete = vi.fn()
      render(<Image src="test.jpg" deletable onDelete={handleDelete} />)

      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      expect(handleDelete).toHaveBeenCalled()
    })

    test('does not show delete button when deletable is false', () => {
      render(<Image src="test.jpg" deletable={false} />)
      const deleteButton = screen.queryByTestId('delete-button')
      expect(deleteButton).not.toBeInTheDocument()
    })
  })

  describe('Style Override', () => {
    // Style Override Tests
    test('applies custom styles through className', () => {
      render(<Image src="test.jpg" className="custom-class" />)
      const img = screen.getByTestId('image-preview')
      expect(img).toHaveClass('custom-class')
    })

    test('applies additional custom styles', () => {
      render(<Image src="test.jpg" className="max-h-10 max-w-10" />)
      const img = screen.getByTestId('image-preview')
      expect(img).toHaveClass('max-h-10 max-w-10')
      // Should still maintain base styles
      expect(img).toHaveClass('rounded-lg object-cover')
    })

    // Accessibility Tests
    test('forwards additional props correctly', () => {
      render(
        <Image src="test.jpg" aria-label="Image preview" title="Test Image" />
      )
      const img = screen.getByTestId('image-preview')
      expect(img).toHaveAttribute('aria-label', 'Image preview')
      expect(img).toHaveAttribute('title', 'Test Image')
    })
  })

  describe('Events', () => {
    // Fullscreen Tests
    test('opens fullscreen mode on click', () => {
      // Test opening fullscreen mode
      render(<Image src="test.jpg" />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const fullscreenImage = screen.getByTestId('fullscreen-image')
      expect(fullscreenImage).toBeInTheDocument()
      expect(fullscreenImage).toHaveClass('max-h-[95vh]')

      // Test closing fullscreen mode
      const overlay = screen.getByTestId('fullscreen-overlay')
      fireEvent.mouseDown(overlay)

      expect(screen.queryByTestId('fullscreen-image')).toBeNull()
    })

    test('handles zoom functionality', () => {
      // Test zoom functionality
      render(<Image src="test.jpg" />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const fullscreenContainer = screen.getByTestId('fullscreen-container')
      fireEvent.mouseDown(fullscreenContainer)

      const zoomedImage = screen.getByTestId('fullscreen-image')
      expect(zoomedImage.style.transform).toBe('scale(2)')

      // Test zoom out functionality
      fireEvent.mouseDown(fullscreenContainer)
      expect(zoomedImage.style.transform).toBe('scale(1)')
    })
  })
})
