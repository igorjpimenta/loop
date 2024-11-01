import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import { Loader2, type LucideIcon } from 'lucide-react'

const buttonVariants = tv({
  base: twMerge(
    'flex items-center justify-center gap-2 border border-transparent transition duration-300 text-stone-50 rounded-lg',
    'disabled:cursor-not-allowed'
  ),
  variants: {
    variant: {
      primary: twMerge(
        'bg-orange-500 enabled:hover:bg-orange-600',
        'disabled:bg-opacity-50'
      ),
      secondary: twMerge(
        'bg-stone-900 text-stone-400 enabled:hover:bg-stone-800',
        'disabled:bg-stone-900/50'
      ),
      danger: twMerge(
        'bg-red-500 enabled:hover:bg-red-600',
        'disabled:bg-red-500/50'
      ),
    },
    shape: {
      icon: twMerge(
        'p-1 bg-transparent enabled:hover:bg-transparent border-transparent',
        'disabled:bg-transparent disabled:text-opacity-50 disabled:border-opacity-50'
      ),
    },
    size: {
      default: 'px-4 py-2',
      sm: 'px-3 py-1.5',
    },
  },
  compoundVariants: [
    {
      shape: 'icon',
      className: 'p-1',
    },
    {
      shape: 'icon',
      variant: 'primary',
      className: 'text-orange-500 enabled:hover:text-orange-600',
    },
    {
      shape: 'icon',
      variant: 'secondary',
      className: 'text-stone-300 enabled:hover:text-stone-400',
    },
    {
      shape: 'icon',
      variant: 'danger',
      className: 'text-red-500 enabled:hover:text-red-600',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> &
  (
    | { shape: 'icon'; icon: LucideIcon }
    | {
        icon?: LucideIcon
        children: React.ReactNode
      }
  ) & {
    isLoading?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      shape,
      variant,
      size,
      icon: Icon,
      isLoading,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <button
        type="button"
        className={twMerge(buttonVariants({ variant, size, shape }), className)}
        ref={forwardedRef}
        {...props}
      >
        {Icon && !isLoading && <Icon className="size-5" />}
        {isLoading && <Loader2 className="size-5 animate-spin" />}

        {children}
      </button>
    )
  }
)
