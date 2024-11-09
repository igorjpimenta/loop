import { mergeRefs } from '../../utils'

import { type ComponentProps, forwardRef, useLayoutEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv, type VariantProps } from 'tailwind-variants'

const textareaVariants = tv({
  base: 'w-full text-stone-300 placeholder:text-stone-500 px-4 py-3 appearance-none resize-none outline-none',
  variants: {
    variant: {
      default: twMerge(
        'bg-stone-900 border border-stone-800 rounded-lg overflow-hidden',
        'focus-visible:border-orange-500 focus-visible:ring-4 ring-orange-500/10'
      ),
      transparent: 'bg-transparent rounded-none overflow-y-auto',
    },
    height: {
      default: 'min-h-24',
      sm: 'min-h-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    height: 'default',
  },
})

type TextareaProps = ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, height, variant, ...props }, forwardedRef) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useLayoutEffect(() => {
      const textarea = textareaRef.current
      if (!textarea) return

      const adjustHeight = () => {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }

      adjustHeight()

      textarea.addEventListener('input', adjustHeight)

      return () => textarea.removeEventListener('input', adjustHeight)
    }, [])

    return (
      <textarea
        ref={mergeRefs(textareaRef, forwardedRef)}
        className={twMerge(textareaVariants({ variant, height }), className)}
        rows={1}
        {...props}
      />
    )
  }
)
