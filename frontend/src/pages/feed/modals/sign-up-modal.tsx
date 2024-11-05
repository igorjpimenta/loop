import {
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from '../../../components/ui/modal'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import type { RegisterUserProps } from '../../../http/register-user'

import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'

interface SignupModalProps {
  onSignup: (data: RegisterUserProps) => Promise<void>
}

const signupSchema = z.object({
  username: z
    .string({ message: 'Invalid username.' })
    .min(3, { message: 'Invalid username.' }),
  password: z
    .string({ message: 'Invalid password.' })
    .min(8, { message: 'Invalid password.' }),
  email: z
    .string({ message: 'Invalid email.' })
    .email({ message: 'Invalid email.' }),
})

export function SignupModal({ onSignup }: SignupModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      setIsLoading(true)

      await onSignup(data)
      reset()
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        const { email, username, password } = error.response.data

        if (email) {
          setError('email', { message: email.join(', ') })
        }

        if (username) {
          setError('username', { message: username.join(', ') })
        }

        if (password) {
          setError('password', { message: password.join(', ') })
        }
      } else {
        setError('root.serverError', {
          message: 'An error occurred, try again later.',
        })
      }
      console.error('Error creating an account:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalContent>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <ModalTitle>Sign up</ModalTitle>
          </div>

          <ModalDescription>Create an account to continue.</ModalDescription>
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
              <span className="text-red-500 text-sm first-letter:capitalize">
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
              <span className="text-red-500 text-sm first-letter:capitalize">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="email"
              render={({ field }) => <Input {...field} placeholder="Email" />}
            />
            {errors.email && (
              <span className="text-red-500 text-sm first-letter:capitalize">
                {errors.email.message}
              </span>
            )}
          </div>

          {errors.root?.serverError && (
            <span className="text-red-500 text-sm first-letter:capitalize">
              {errors.root.serverError.message}
            </span>
          )}
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
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </div>
      </form>
    </ModalContent>
  )
}
