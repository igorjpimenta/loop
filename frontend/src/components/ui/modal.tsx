import { type ComponentProps, forwardRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Button } from './button'

export function Modal(props: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Root {...props} />
}

export function ModalTrigger(props: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.DialogTrigger {...props} />
}

export function ModalClose(props: DialogPrimitive.DialogCloseProps) {
  return <DialogPrimitive.DialogClose {...props} />
}

function ModalPortal(props: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.DialogPortal {...props} />
}

type ModalOverlayProps = ComponentProps<'div'> &
  DialogPrimitive.DialogOverlayProps

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  ({ ...props }, ref) => {
    return (
      <DialogPrimitive.DialogOverlay
        {...props}
        ref={ref}
        className="fixed inset-0 bg-black/60 data-[state=open]:animate-overlayShow"
      />
    )
  }
)

export function ModalContent({
  children,
  ...props
}: DialogPrimitive.DialogContentProps) {
  return (
    <ModalPortal>
      <ModalOverlay />
      <DialogPrimitive.DialogContent
        {...props}
        onPointerDownOutside={e => e.preventDefault()}
        className={twMerge(
          'fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[85vh] w-[90vw] max-w-[450px] data-[state=open]:animate-contentShow rounded-xl border border-stone-800 hover:border-stone-700 bg-stone-950 p-6 overflow-y-auto focus:outline-none',
          props.className
        )}
      >
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

        {children}
      </DialogPrimitive.DialogContent>
    </ModalPortal>
  )
}

export function ModalTitle(props: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.DialogTitle {...props} className="text-lg font-semibold" />
  )
}

export function ModalDescription(
  props: DialogPrimitive.DialogDescriptionProps
) {
  return (
    <DialogPrimitive.DialogDescription
      {...props}
      className="text-stone-400 text-sm leading-relaxed"
    />
  )
}
