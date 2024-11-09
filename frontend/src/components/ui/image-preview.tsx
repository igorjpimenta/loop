import { Button } from './button'

import { Trash2 } from 'lucide-react'

type ImagePreviewProps = {
  image: File | string | undefined
} & (
  | { deletable?: true; onDelete: () => void }
  | { deletable?: false; onDelete?: never }
)

export function ImagePreview({
  image,
  deletable = true,
  onDelete,
}: ImagePreviewProps) {
  if (!image) return null

  const imageUrl = image instanceof File ? URL.createObjectURL(image) : image

  return (
    <div className="flex items-center justify-start pt-0">
      <div className="relative w-fit">
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-44 max-h-44 rounded-lg object-cover"
        />

        {deletable && (
          <Button
            onClick={onDelete}
            variant="secondary"
            shape="icon"
            icon={Trash2}
            className="absolute top-1 right-1 enabled:hover:text-red-500"
          />
        )}
      </div>
    </div>
  )
}
