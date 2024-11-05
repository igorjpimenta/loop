import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'

const badgeVariants = tv({
  base: 'px-2.5 py-0.5 border rounded-full text-sm transition-all duration-300 cursor-default select-none',
  variants: {
    state: {
      filled: twMerge(
        'bg-stone-900 text-stone-300 border-transparent',
        'data-[uniform=false]:hover:bg-stone-800'
      ),
      outlined: twMerge(
        'border-dashed border-stone-700 text-stone-300',
        'data-[uniform=false]:hover:border-stone-500',
        'data-[uniform=false]:data-[highlighted=true]:!border-orange-500 data-[uniform=false]:data-[highlighted=true]:hover:text-stone-100'
      ),
    },
  },
  defaultVariants: {
    state: 'filled',
  },
})

interface BadgeProps
  extends ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {
  highlighted?: boolean
  uniform?: boolean
}

export function Badge({
  children,
  className,
  state,
  highlighted = false,
  uniform = true,
  ...props
}: BadgeProps) {
  return (
    <span
      data-uniform={uniform}
      data-highlighted={highlighted}
      className={twMerge(badgeVariants({ state }), className)}
      {...props}
    >
      {children}
    </span>
  )
}
