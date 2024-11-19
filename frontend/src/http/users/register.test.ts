import { registerHttpScenarios } from '../../test/scenarios'
import type { DeepPartial } from '../../types/test-factory'
import type { User } from '../../context/user-context'
import { register, type RegisterProps } from './register'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')

type MockData = {
  requestData: RegisterProps
  responseData: {
    data: User
  }
}

describe('register', () => {
  const mockData = (overrides?: DeepPartial<RegisterProps>): MockData => {
    const id = 'user2'
    const username = 'newUser'
    const password = 'newPassword'
    const email = 'new@example.com'

    return {
      requestData: { username, password, email, ...overrides },
      responseData: {
        data: {
          id,
          username,
          email,
          ...(overrides &&
            Object.fromEntries(
              Object.entries(overrides).filter(([key]) => key !== 'password')
            )),
        },
      },
    }
  }

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('Successful registration', () => {
    test('successful registration returns user data', async () => {
      const { requestData, responseData } = mockData()
      ;(axios.post as Mock).mockResolvedValueOnce(responseData)
      const result = await register(requestData)

      expect(result).toEqual(responseData.data)
      expect(axios.post).toHaveBeenCalledWith('/register/', requestData)
    })
  })

  describe('Validation errors', () => {
    test('handles error when username is already taken', async () => {
      const { requestData } = mockData({ username: 'oldUser' })
      const error = registerHttpScenarios.usernameTaken()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(register(requestData)).rejects.toEqual(error)
    })

    test('handles error when email is already taken', async () => {
      const { requestData } = mockData({ email: 'old@example.com' })
      const error = registerHttpScenarios.emailTaken()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(register(requestData)).rejects.toEqual(error)
    })

    test('handles invalid email format', async () => {
      const { requestData } = mockData({ email: 'invalid-email' })
      const error = registerHttpScenarios.invalidEmail()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(register(requestData)).rejects.toEqual(error)
    })

    test('handles short password', async () => {
      const { requestData } = mockData({ password: 'short' })
      const error = registerHttpScenarios.shortPassword()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(register(requestData)).rejects.toEqual(error)
    })

    test('handles numeric password', async () => {
      const { requestData } = mockData({ password: '12345678' })
      const error = registerHttpScenarios.numericPassword()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(register(requestData)).rejects.toEqual(error)
    })

    test('handles common password', async () => {
      const { requestData } = mockData({ password: 'password123' })

      const error = registerHttpScenarios.commonPassword()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(register(requestData)).rejects.toEqual(error)
    })
  })
})
