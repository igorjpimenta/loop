import type { ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { LucideIcon } from 'lucide-react'

const buttonVariants = tv({
  base: twMerge(
    'border border-transparent transition duration-300 text-stone-50 px-4 py-2 rounded-lg',
    'disabled:cursor-not-allowed'
  ),
  variants: {
    variant: {
      primary: twMerge(
        'bg-orange-500 enabled:hover:bg-orange-600',
        'disabled:bg-opacity-50'
      ),
      secondary: twMerge(
        'bg-rose-400 enabled:hover:bg-rose-500',
        'disabled:bg-rose-400/50'
      ),
      icon: twMerge(
        'p-1 border-transparent bg-transparent text-stone-300 enabled:hover:text-stone-400',
        'disabled:text-opacity-50 disabled:border-opacity-50'
      ),
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    icon?: LucideIcon
  } & (
    | { variant: 'icon'; icon: LucideIcon }
    | {
        variant: Exclude<VariantProps<typeof buttonVariants>['variant'], 'icon'>
        icon?: LucideIcon
      }
  )

export function Button({
  className,
  variant,
  icon: Icon,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(buttonVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon className="size-5" />}
    </button>
  )
}
