import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ModalContent, ModalTitle } from '../../../components/ui/modal'

interface ImageModalProps {
  image: string
  title: string
}

export function ImageModal({ image, title }: ImageModalProps) {
  return (
    <ModalContent
      allowPointerDownOutside={true}
      aria-describedby={undefined}
      className="w-fit max-w-none max-h-none p-0 overflow-hidden"
    >
      <VisuallyHidden asChild>
        <ModalTitle>{title}</ModalTitle>
      </VisuallyHidden>

      <img src={image} alt={title} className="max-w-[95vw] max-h-[95vh]" />
    </ModalContent>
  )
}
