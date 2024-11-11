import {
  MultiSelectGroup,
  MultiSelectItem,
} from '../../../../components/ui/multi-select'
import { Badge } from '../../../../components/ui/badge'
import {
  ACCEPTED_IMAGE_TYPES,
  ImageInput,
} from '../../../../components/ui/image-input'
import { Image } from '../../../../components/ui/image'
import { Button } from '../../../../components/ui/button'
import { Textarea } from '../../../../components/ui/textarea'
import { mergeRefs } from '../../../../utils'
import { getTopics, type Topic } from '../../../../http/posts/get-topics'
import { createPost } from '../../../../http/posts/create-post'
import type { Post } from '../../../../http/posts/get-posts'

import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendHorizonal, Plus, Minus } from 'lucide-react'
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(500, 'You have exceeded the maximum character limit'),
  topics: z
    .array(z.string())
    .min(1, 'Select at least one topic')
    .max(3, 'Maximum 3 topics allowed'),
  image: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp shapes are supported'
    )
    .optional(),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>

interface CreatePostProps {
  userId: string
  onPostCreated: (post: Post) => void
}

export function CreatePost({ userId, onPostCreated }: CreatePostProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadTopics() {
      const fetchedTopics = await getTopics()
      setTopics(fetchedTopics)
    }

    loadTopics()
  }, [])

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      topics: [],
    },
    mode: 'onChange',
  })

  const image = watch('image')

  const handleImageChange = (file: File): File | null => {
    const { success, error } = createPostSchema
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

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      setIsSubmitting(true)

      const newPost = await createPost({ userId, ...data })
      reset()

      onPostCreated(newPost)
    } catch (error) {
      if (error instanceof Response && error.status === 401) {
        setError('root.serverError', {
          message: 'You must be logged in to create a post.',
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
      className="flex flex-col gap-3 bg-stone-900 rounded-xl p-3 max-h-[90vh] overflow-hidden"
    >
      <div className="flex flex-col gap-1 min-h-0">
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <div className="flex flex-col gap-1 overflow-hidden">
              <Textarea
                {...field}
                placeholder="What's on your mind?"
                className="p-1"
                variant="transparent"
              />

              {errors.content && (
                <div className="flex items-center justify-between gap-3 text-sm text-stone-500">
                  <span className="text-red-500">
                    {createPostSchema
                      .pick({ content: true })
                      .safeParse({ content: field.value })
                      ?.error?.errors.map(e => e.message)
                      .join(', ')}
                  </span>

                  <span>
                    <span className="text-red-500">{field.value.length}</span>/
                    {createPostSchema.shape.content.maxLength ?? 500}
                  </span>
                </div>
              )}
            </div>
          )}
        />
      </div>

      <Image src={image} kind="preview" onDelete={handleImageDelete} />

      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="topics"
          render={({ field }) => (
            <MultiSelectGroup {...field}>
              {topics.map(({ id, name }) => (
                <MultiSelectItem key={id} value={id}>
                  <Badge
                    className="cursor-pointer select-none"
                    uniform={false}
                    highlighted={field.value.includes(id)}
                    state="outlined"
                  >
                    <div className="flex items-center gap-1">
                      {field.value.includes(id) ? (
                        <Minus className="size-4" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                      {name}
                    </div>
                  </Badge>
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          )}
        />

        {errors.topics && (
          <p className="text-red-500 text-sm">{errors.topics.message}</p>
        )}

        {errors.root?.serverError && (
          <p className="text-red-500 text-sm">
            {errors.root.serverError.message}
          </p>
        )}
      </div>

      <div className="flex justify-between bg-stone-800 -m-3 mt-0 py-2 px-3">
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <div className="flex flex-col gap-1 w-fit">
              <ImageInput
                ref={mergeRefs(imageInputRef, field.ref)}
                name={field.name}
                onChange={file => field.onChange(handleImageChange(file))}
                onBlur={field.onBlur}
                disabled={!!field.value || isSubmitting}
              />

              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
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
