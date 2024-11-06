import {
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from '../../../components/ui/modal'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import type { LogUserInCredentials } from '../../../http/log-user-in'

import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'

interface LoginModalProps {
  onLogin: (data: LogUserInCredentials) => Promise<void>
}

const loginSchema = z.object({
  username: z
    .string({ message: 'Invalid username.' })
    .min(3, { message: 'Invalid username.' }),
  password: z
    .string({ message: 'Invalid password.' })
    .min(8, { message: 'Invalid password.' }),
})

export function LoginModal({ onLogin }: LoginModalProps) {
  const {
    control,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true)

      await onLogin(data)
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError('root.serverError', { message: 'Invalid credentials.' })
      } else {
        setError('root.serverError', {
          message: 'An error occurred, try again later.',
        })
      }

      resetField('password')
      console.error('Error logging in:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalContent>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ModalTitle>Login</ModalTitle>
          </div>

          <ModalDescription>
            Login to your account to continue.
          </ModalDescription>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Input {...field} placeholder="Username" />
              )}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input {...field} placeholder="Password" type="password" />
              )}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}

            {errors.root?.serverError && (
              <span className="text-red-500 text-sm">
                {errors.root.serverError.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-6">
          <ModalTrigger asChild>
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
          </ModalTrigger>

          <Button
            className="flex-1"
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </ModalContent>
  )
}