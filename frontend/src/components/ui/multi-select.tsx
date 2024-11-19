import React, { type ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface MultiSelectProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  onChange: (selections: string[]) => void
  value: string[]
}

export const MultiSelectGroup = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ className, onChange, value, ...props }, forwardedRef) => {
    const handleToggle = (option: string) => {
      const newSelectedOptions = value.includes(option)
        ? value.filter(t => t !== option)
        : [...value, option]

      onChange(newSelectedOptions)
    }

    return (
      <div
        className={twMerge('flex flex-wrap gap-2', className)}
        ref={forwardedRef}
        data-testid="multi-select-group"
        {...props}
      >
        {React.Children.map(props.children, child => {
          if (
            React.isValidElement<MultiSelectItemProps>(child) &&
            child.type === MultiSelectItem
          ) {
            const { value } = child.props

            return React.cloneElement(child, {
              checked: value.includes(value),
              onChange: () => handleToggle(value),
            })
          }

          return child
        })}
      </div>
    )
  }
)

interface MultiSelectItemProps extends Omit<ComponentProps<'input'>, 'type'> {
  value: string
}

export const MultiSelectItem = forwardRef<
  HTMLInputElement,
  MultiSelectItemProps
>(({ checked, children, className, ...props }, forwardedRef) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        data-testid="multi-select-item"
        type="checkbox"
        className="peer appearance-none"
        checked={checked}
        ref={forwardedRef}
        {...props}
      />

      <div
        data-checked={checked}
        className={twMerge(
          'group flex items-center justify-center overflow-hidden',
          className
        )}
      >
        {children}
      </div>
    </label>
  )
})
