import { mergeRefs } from '../../utils'

import { type ComponentProps, forwardRef, useLayoutEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

type TextareaProps = ComponentProps<'textarea'>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, forwardedRef) => {
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
        className={twMerge(
          'w-full min-h-24 text-stone-300 placeholder:text-stone-500 p-4 rounded appearance-none resize-none outline-none overflow-y-auto',
          className
        )}
        {...props}
      />
    )
  }
)
