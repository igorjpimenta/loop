import { Button } from './button'
import { mergeRefs } from '../../utils'

import { type ComponentProps, forwardRef, useRef } from 'react'
import { ImagePlus } from 'lucide-react'

interface ImageInputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  onChange?: (file: File) => void
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  ({ onChange, ...props }, forwardedRef) => {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
      <label className="block">
        <span className="sr-only">Choose image</span>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => inputRef.current?.click()}
            variant="secondary"
            shape="icon"
            icon={ImagePlus}
            disabled={props.disabled}
          />

          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0] ?? null

              if (file) {
                onChange?.(file)
              }
            }}
            className="hidden"
            ref={mergeRefs(inputRef, forwardedRef)}
            {...props}
          />
        </div>
      </label>
    )
  }
)
