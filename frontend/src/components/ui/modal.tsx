import { Button } from './button'

import { type ComponentProps, forwardRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function Modal(props: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Root {...props} />
}

export function ModalTrigger(props: DialogPrimitive.DialogTriggerProps) {
  return (
    <DialogPrimitive.DialogTrigger data-testid="modal-trigger" {...props} />
  )
}

export function ModalClose(props: DialogPrimitive.DialogCloseProps) {
  return <DialogPrimitive.DialogClose data-testid="close-modal" {...props} />
}

function ModalPortal(props: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.DialogPortal {...props} />
}

type ModalOverlayProps = ComponentProps<'div'> &
  DialogPrimitive.DialogOverlayProps

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  ({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.DialogOverlay
        {...props}
        ref={ref}
        data-testid="modal-overlay"
        className={twMerge(
          'fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-overlayShow',
          className
        )}
      />
    )
  }
)

interface ModalContentProps extends DialogPrimitive.DialogContentProps {
  allowPointerDownOutside?: boolean
}

export function ModalContent({
  children,
  className,
  allowPointerDownOutside = false,
  ...props
}: ModalContentProps) {
  return (
    <ModalPortal>
      <ModalOverlay />
      <DialogPrimitive.DialogContent
        {...props}
        onPointerDownOutside={
          allowPointerDownOutside ? undefined : e => e.preventDefault()
        }
        className={twMerge(
          'rounded-xl border border-stone-800 hover:border-stone-700 bg-stone-950 p-6 overflow-y-auto focus:outline-none',
          'z-50 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[85vh] w-[90vw] max-w-[450px]',
          'data-[state=open]:animate-contentShow',
          className
        )}
      >
        {!allowPointerDownOutside && (
          <ModalClose
            asChild
            className="absolute top-3 right-3 inline-flex items-center justify-center"
          >
            <Button
              className="text-stone-600"
              variant="secondary"
              shape="icon"
              icon={X}
            />
          </ModalClose>
        )}

        {children}
      </DialogPrimitive.DialogContent>
    </ModalPortal>
  )
}

export function ModalTitle({
  className,
  ...props
}: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.DialogTitle
      {...props}
      className={twMerge('text-lg font-semibold', className)}
    />
  )
}

export function ModalDescription({
  className,
  ...props
}: DialogPrimitive.DialogDescriptionProps) {
  return (
    <DialogPrimitive.DialogDescription
      {...props}
      className={twMerge('text-stone-400 text-sm leading-relaxed', className)}
    />
  )
}
