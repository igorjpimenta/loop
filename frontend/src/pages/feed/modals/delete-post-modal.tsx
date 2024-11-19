import {
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from '../../../components/ui/modal'
import { Button } from '../../../components/ui/button'

import { useState } from 'react'

interface DeletePostModalProps {
  onSubmit: () => Promise<void>
}

export function DeletePostModal({ onSubmit }: DeletePostModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ message: string } | null>(null)

  const handleDelete = async () => {
    try {
      setIsLoading(true)

      await onSubmit()
    } catch (error) {
      setError({ message: 'An error occurred, try again later.' })
      console.error('Error deleting post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalContent data-testid="delete-post-modal">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ModalTitle>Delete post?</ModalTitle>
          </div>

          <ModalDescription>This action can't be undone.</ModalDescription>

          {error && (
            <span className="text-red-500 text-sm">{error.message}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-6">
          <ModalTrigger asChild>
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
          </ModalTrigger>

          <Button
            variant="danger"
            className="flex-1"
            onClick={handleDelete}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </ModalContent>
  )
}
