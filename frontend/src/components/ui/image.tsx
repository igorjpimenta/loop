import { Button } from './button'

import {
  type ComponentProps,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react'
import { Trash2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { tv, type VariantProps } from 'tailwind-variants'

const imageVariants = tv({
  base: 'max-w-44 max-h-44 rounded-lg object-cover',
  variants: {
    kind: {
      default: 'max-w-full max-h-[100vh] rounded-lg h-auto object-cover',
      preview: 'max-w-44 max-h-44 rounded-lg object-cover',
    },
  },
  defaultVariants: {
    kind: 'default',
  },
})

type ImageProps = Omit<ComponentProps<'img'>, 'src'> &
  VariantProps<typeof imageVariants> & {
    src: File | string | undefined
  } & (
    | { deletable?: true; onDelete: () => void }
    | { deletable?: false; onDelete?: never }
  )

export function Image({
  className,
  src,
  kind,
  deletable = false,
  onDelete,
  ...props
}: ImageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!src) return null

  const imageUrl = src instanceof File ? URL.createObjectURL(src) : src

  return (
    <div className="flex items-center justify-start pt-0">
      <div className="relative w-fit">
        <button type="button" onClick={() => setIsFullscreen(true)}>
          <img
            data-testid="image-preview"
            src={imageUrl}
            aria-hidden={true}
            alt="preview"
            className={twMerge(imageVariants({ kind }), className)}
            {...props}
          />
        </button>

        {isFullscreen && (
          <FullScreenImage
            src={imageUrl}
            onOverlayClick={() => setIsFullscreen(false)}
          />
        )}

        {deletable && (
          <Button
            data-testid="delete-button"
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

interface FullScreenImageProps extends Pick<ImageProps, 'src'> {
  src: string
  onOverlayClick: () => void
}

export function FullScreenImage({ src, onOverlayClick }: FullScreenImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({
    transform: 'scale(1)',
    transformOrigin: '0 0',
  })

  const updateTransformOrigin = useCallback(
    (clientX: number, clientY: number, isZoomed: boolean) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()

      const x = ((clientX - rect.left) / rect.width) * 100
      const y = ((clientY - rect.top) / rect.height) * 100

      const clampedX = Math.min(Math.max(x, 0), 100)
      const clampedY = Math.min(Math.max(y, 0), 100)

      if (isZoomed) {
        setImgStyle(prev => ({
          ...prev,
          transformOrigin: `${clampedX}% ${clampedY}%`,
        }))
      }
    },
    []
  )

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (!containerRef.current || !imageRef.current) return

      setIsZoomed(prev => {
        const newZoomed = !prev

        updateTransformOrigin(e.clientX, e.clientY, newZoomed)

        if (newZoomed) {
          setImgStyle(prev => ({
            ...prev,
            transform: 'scale(2)',
          }))
        } else {
          setImgStyle(prev => ({
            ...prev,
            transform: 'scale(1)',
          }))
        }

        return newZoomed
      })
    },
    [updateTransformOrigin]
  )

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !isZoomed) return

      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e

      updateTransformOrigin(clientX, clientY, true)
    },
    [isDragging, isZoomed, updateTransformOrigin]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOverlayClick()
      setIsZoomed(false)
    }
  }

  useEffect(() => {
    if (isZoomed) {
      containerRef.current?.addEventListener('mousemove', handleMove)
      containerRef.current?.addEventListener('touchmove', handleMove)
      containerRef.current?.addEventListener('mouseup', () => handleDragEnd)
      containerRef.current?.addEventListener('touchend', () => handleDragEnd)
      setIsDragging(true)
    }

    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMove)
      containerRef.current?.removeEventListener('touchmove', handleMove)
      containerRef.current?.removeEventListener('mouseup', () => handleDragEnd)
      containerRef.current?.removeEventListener('touchend', () => handleDragEnd)
      setIsDragging(false)
    }
  }, [isZoomed, handleMove, handleDragEnd])
  return (
    <div
      data-testid="fullscreen-overlay"
      onMouseDown={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-overlayShow"
    >
      <div
        data-testid="fullscreen-container"
        ref={containerRef}
        onMouseDown={handleImageClick}
        className={twMerge(
          'relative border border-stone-800 hover:border-stone-700 overflow-hidden rounded-lg',
          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        )}
      >
        <img
          data-testid="fullscreen-image"
          ref={imageRef}
          src={src}
          aria-hidden={true}
          alt="fullscreen"
          className="max-h-[95vh] max-w-[95vw] object-contain select-none transition-transform duration-300 ease-in-out scroll-smooth"
          style={imgStyle}
        />
      </div>
    </div>
  )
}
