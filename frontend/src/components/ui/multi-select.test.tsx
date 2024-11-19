import { MultiSelectGroup, MultiSelectItem } from './multi-select'

import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { useState } from 'react'

interface MultiSelectTestProps {
  onChange: (selections: string[]) => void
}
const MultiSelectTest: React.FC<MultiSelectTestProps> = ({ onChange }) => {
  const [selections, setSelections] = useState(['option1'])
  const handleChange = (newSelections: string[]) => {
    setSelections(newSelections)
    onChange(newSelections)
  }

  return (
    <MultiSelectGroup value={selections} onChange={handleChange}>
      <MultiSelectItem value="option1">Option 1</MultiSelectItem>
      <MultiSelectItem value="option2">Option 2</MultiSelectItem>
      <MultiSelectItem value="option3">Option 3</MultiSelectItem>
    </MultiSelectGroup>
  )
}

describe('MultiSelectGroup Component', () => {
  describe('Rendering', () => {
    test('renders with default props', () => {
      render(
        <MultiSelectGroup value={[]} onChange={() => {}}>
          <MultiSelectItem value="option1">Option 1</MultiSelectItem>
        </MultiSelectGroup>
      )
      const optionElement = screen.getByText(/option 1/i)
      expect(optionElement).toBeInTheDocument()
    })
  })

  describe('Events', () => {
    test('toggles selection state when clicked', () => {
      // Test for selection state change
      const handleChange = vi.fn()

      render(<MultiSelectTest onChange={handleChange} />)

      fireEvent.click(screen.getByText(/option 2/i).closest('label')!)
      expect(handleChange).toHaveBeenCalledWith(['option1', 'option2'])

      fireEvent.click(screen.getByText(/option 2/i).closest('label')!)
      expect(handleChange).toHaveBeenCalledWith(['option1'])
    })

    test('handles multiple selections correctly', () => {
      // Test for multiple selections
      const handleChange = vi.fn()

      render(<MultiSelectTest onChange={handleChange} />)

      fireEvent.click(screen.getByText(/option 2/i).closest('label')!)
      fireEvent.click(screen.getByText(/option 3/i).closest('label')!)
      expect(handleChange).toHaveBeenCalledWith([
        'option1',
        'option2',
        'option3',
      ])
    })
  })

  describe('Style Override', () => {
    // Style Override Tests
    test('allows style overrides through className', () => {
      render(
        <MultiSelectGroup
          className="custom-class"
          value={[]}
          onChange={() => {}}
        >
          <MultiSelectItem value="option1">Option 1</MultiSelectItem>
        </MultiSelectGroup>
      )
      const groupElement = screen.getByTestId('multi-select-group')
      expect(groupElement).toHaveClass('custom-class')
    })

    // Accessibility Tests
    test('passes through additional props', () => {
      render(
        <MultiSelectGroup
          value={[]}
          onChange={() => {}}
          aria-label="multi-select"
        >
          <MultiSelectItem value="option1" aria-label="option1">
            Option 1
          </MultiSelectItem>
        </MultiSelectGroup>
      )
      const groupElement = screen.getByLabelText(/multi-select/i)
      expect(groupElement).toBeInTheDocument()
      const optionElement = screen.getByLabelText(/option1/i)
      expect(optionElement).toBeInTheDocument()
    })
  })
})
