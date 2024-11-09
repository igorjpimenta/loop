import { Textarea } from '../../../../components/ui/textarea'
import { Button } from '../../../../components/ui/button'
import {
  ACCEPTED_IMAGE_TYPES,
  ImageInput,
} from '../../../../components/ui/image-input'
import { ImagePreview } from '../../../../components/ui/image-preview'
import { createComment } from '../../../../http/post-actions/create-comment'
import type { Comment } from '../../../../http/post-actions/get-comments'
import { mergeRefs } from '../../../../utils'

import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendHorizonal } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(500, 'You have exceeded the maximum character limit'),
  image: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp shapes are supported'
    )
    .optional(),
})

export type CreateCommentFormData = z.infer<typeof createCommentSchema>

interface CreateCommentFormProps {
  postId: string
  onCommentCreated: (comment: Comment) => void
}

export function CreateCommentForm({
  postId,
  onCommentCreated,
}: CreateCommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
    },
    mode: 'onChange',
  })

  const image = watch('image')

  const handleImageChange = (file: File): File | null => {
    const { success, error } = createCommentSchema
      .pick({ image: true })
      .safeParse({ image: file })

    if (!success) {
      const errorMessage = error.errors.map(e => e.message).join(', ')

      setError('image', { message: errorMessage })
      return null
    }

    return file
  }

  const handleImageDelete = () => {
    setValue('image', undefined)

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: CreateCommentFormData) => {
    try {
      setIsSubmitting(true)

      const comment = await createComment({ postId, ...data })
      onCommentCreated(comment)
      reset()
    } catch (error) {
      console.error(error)
      if (error instanceof Response && error.status === 401) {
        setError('root.serverError', {
          message: 'You must be logged in to create a comment.',
        })
      } else {
        setError('root.serverError', {
          message: 'An error occurred, try again later.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge(
        'relative flex flex-col gap-3 p-3 border border-stone-800 bg-stone-900 rounded-lg overflow-hidden',
        'has-[:focus-visible]:border-orange-500 has-[:focus-visible]:ring-4 ring-orange-500/10'
      )}
    >
      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <div className="flex flex-col gap-1 overflow-hidden">
            <Textarea
              {...field}
              variant="transparent"
              height="sm"
              className="px-1 py-0"
              placeholder="Add a comment..."
            />

            {errors.content && (
              <div className="flex items-center justify-between gap-3 text-sm text-stone-500">
                <span className="text-red-500">
                  {createCommentSchema
                    .pick({ content: true })
                    .safeParse({ content: field.value })
                    ?.error?.errors.map(e => e.message)
                    .join(', ')}
                </span>

                <span>
                  <span className="text-red-500">{field.value.length}</span>/
                  {createCommentSchema.shape.content.maxLength ?? 500}
                </span>
              </div>
            )}
          </div>
        )}
      />

      <ImagePreview image={image} onDelete={handleImageDelete} />

      {errors.root?.serverError && (
        <p className="text-red-500 text-sm">
          {errors.root.serverError.message}
        </p>
      )}

      <div className="flex justify-between bg-stone-800 -m-3 mt-0 py-2 px-3">
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <div className="flex flex-col gap-1 w-fit">
              <ImageInput
                ref={mergeRefs(imageInputRef, field.ref)}
                name={field.name}
                accept={ACCEPTED_IMAGE_TYPES.map(
                  type => `.${type.split('/')[1]}`
                ).join(', ')}
                onChange={file => field.onChange(handleImageChange(file))}
                onBlur={field.onBlur}
                disabled={!!field.value || isSubmitting}
              />

              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          shape="icon"
          icon={SendHorizonal}
        />
      </div>
    </form>
  )
}
