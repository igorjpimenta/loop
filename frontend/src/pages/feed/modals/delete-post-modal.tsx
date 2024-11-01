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

  const handleSubmit = async () => {
    setIsLoading(true)

    await onSubmit()

    setIsLoading(false)
  }

  return (
    <ModalContent>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ModalTitle>Delete post?</ModalTitle>
          </div>

          <ModalDescription>This action can't be undone.</ModalDescription>
        </div>

        <div className="flex items-center justify-between gap-6">
          <ModalTrigger asChild>
            <Button variant="secondary" size="sm" className="flex-1">
              Cancel
            </Button>
          </ModalTrigger>

          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            onClick={handleSubmit}
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
