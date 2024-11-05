import { type ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

type InputProps = ComponentProps<'input'>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <input
        ref={forwardedRef}
        className={twMerge(
          'px-4 h-12 bg-stone-900 border border-stone-800 rounded-lg placeholder-stone-400 hover:border-stone-700 outline-none',
          'focus-visible:border-orange-500 focus-visible:ring-4 ring-orange-500/10',
          className
        )}
        {...props}
      />
    )
  }
)
