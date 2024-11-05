import { forwardRef, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv, type VariantProps } from 'tailwind-variants'

const separatorVariants = tv({
  base: 'bg-stone-800',
  variants: {
    orientation: {
      horizontal: 'h-px',
      vertical: 'w-px',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

type SeparatorProps = ComponentProps<'div'> &
  VariantProps<typeof separatorVariants>

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={twMerge(separatorVariants({ orientation }), className)}
      />
    )
  }
)
