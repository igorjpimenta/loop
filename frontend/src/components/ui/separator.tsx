import { forwardRef, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type SeparatorProps = ComponentProps<'div'>

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={twMerge('h-px bg-stone-800', props.className)}
      />
    )
  }
)
