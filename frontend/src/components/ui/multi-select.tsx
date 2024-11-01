import React, {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from 'react'
import { twMerge } from 'tailwind-merge'

interface MultiSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onChange: (topics: string[]) => void
  value: string[]
}

export const MultiSelectGroup = forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ className, onChange, value, ...props }, forwardedRef) => {
    const handleToggle = (topic: string) => {
      const newSelectedTopics = value.includes(topic)
        ? value.filter(t => t !== topic)
        : [...value, topic]

      onChange(newSelectedTopics)
    }

    return (
      <div
        className={twMerge('flex flex-wrap gap-2', className)}
        ref={forwardedRef}
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

interface MultiSelectItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string
}

export const MultiSelectItem = forwardRef<
  HTMLInputElement,
  MultiSelectItemProps
>(({ checked, children, className, ...props }, forwardedRef) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
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
