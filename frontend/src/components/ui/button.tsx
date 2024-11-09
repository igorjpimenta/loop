import { type ComponentProps, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import { Loader2, type LucideIcon } from 'lucide-react'

const buttonVariants = tv({
  base: twMerge(
    'flex items-center justify-center gap-2 border border-transparent transition duration-300 text-stone-50 rounded-lg',
    'disabled:cursor-not-allowed'
  ),
  variants: {
    shape: {
      regular: '',
      icon: 'p-1',
      link: 'p-0',
    },
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
    size: {
      lg: 'text-lg',
      md: 'text-base',
      sm: 'text-sm',
    },
  },
  compoundVariants: [
    {
      shape: 'regular',
      size: 'lg',
      className: 'px-4 py-2',
    },
    {
      shape: 'regular',
      size: 'md',
      className: 'px-3 py-1.5',
    },
    {
      shape: 'regular',
      size: 'sm',
      className: 'px-2 py-1',
    },
    {
      shape: ['icon', 'link'],
      className: twMerge(
        'bg-transparent enabled:hover:bg-transparent border-transparent',
        'disabled:bg-transparent disabled:text-opacity-50 disabled:border-opacity-50'
      ),
    },
    {
      shape: ['icon', 'link'],
      variant: 'primary',
      className: 'text-orange-500 enabled:hover:text-orange-600',
    },
    {
      shape: ['icon', 'link'],
      variant: 'secondary',
      className: 'text-stone-300 enabled:hover:text-stone-400',
    },
    {
      shape: ['icon', 'link'],
      variant: 'danger',
      className: 'text-red-500 enabled:hover:text-red-600',
    },
  ],
  defaultVariants: {
    shape: 'regular',
    variant: 'primary',
    size: 'md',
  },
})

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> &
  (
    | { shape: 'icon'; icon: LucideIcon }
    | {
        icon?: LucideIcon
        children: React.ReactNode
      }
    | {
        icon: LucideIcon
        children?: React.ReactNode
      }
  ) & {
    isLoading?: boolean
    filled?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      filled,
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
        {Icon && !isLoading && (
          <Icon className={twMerge('size-5', filled && 'fill-current')} />
        )}
        {isLoading && <Loader2 className="size-5 animate-spin" />}

        {children}
      </button>
    )
  }
)
