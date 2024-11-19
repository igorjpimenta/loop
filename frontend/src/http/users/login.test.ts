import { loginHttpScenarios } from '../../test/scenarios'
import type { DeepPartial } from '../../types/test-factory'
import type { User } from '../../context/user-context'
import { login, type LoginCredentials } from './login'

import { afterEach, describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'

vi.mock('axios')

type MockData = {
  credentials: LoginCredentials
  responseData: { data: User }
}

describe('login', () => {
  const mockData = (overrides?: DeepPartial<LoginCredentials>): MockData => {
    const id = 'user1'
    const username = 'testUser'
    const password = 'testPassword'
    const email = 'test@example.com'

    return {
      credentials: { username, password, ...overrides },
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
    axios.defaults.headers.common = {}
  })

  describe('Successful login', () => {
    test('returns user data with valid credentials and CSRF token', async () => {
      const { credentials, responseData } = mockData()
      const validCsrfToken = 'NNNPfK8Gq96HHWvjl5fqyl05aWdzcw4k'

      axios.defaults.headers.common = {
        'X-CSRFToken': validCsrfToken,
        Cookie: `sessionid=abc123; csrftoken=${validCsrfToken}`,
      }
      ;(axios.post as Mock).mockResolvedValueOnce(responseData)

      await expect(login(credentials)).resolves.toEqual(responseData.data)
      expect(axios.post).toHaveBeenCalledWith('/login/', credentials)
    })
  })

  describe('CSRF Token Validation', () => {
    test('handles missing CSRF token', async () => {
      const { credentials } = mockData()
      const error = loginHttpScenarios.missingCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(login(credentials)).rejects.toEqual(error)
    })

    test('handles invalid CSRF token', async () => {
      const { credentials } = mockData()

      // Set up invalid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'invalid-token-that-have-32-char-',
      }

      const error = loginHttpScenarios.invalidCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(login(credentials)).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      const { credentials } = mockData()

      // Set up CSRF token with incorrect length
      axios.defaults.headers.common = {
        'X-CSRFToken': 'short-token',
      }

      const error = loginHttpScenarios.invalidCsrfLength()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(login(credentials)).rejects.toEqual(error)
    })
  })

  describe('Credential Validation', () => {
    test('handles invalid username', async () => {
      const { credentials } = mockData({ username: 'wrongUser' })

      // Set up valid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'NNNPfK8Gq96HHWvjl5fqyl05aWdzcw4k',
      }

      const error = loginHttpScenarios.invalidCredentials()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(login(credentials)).rejects.toEqual(error)
    })

    test('handles invalid password', async () => {
      const { credentials } = mockData({ password: 'wrongPassword' })

      // Set up valid CSRF token
      axios.defaults.headers.common = {
        'X-CSRFToken': 'NNNPfK8Gq96HHWvjl5fqyl05aWdzcw4k',
      }

      const error = loginHttpScenarios.invalidCredentials()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(login(credentials)).rejects.toEqual(error)
    })
  })
})
