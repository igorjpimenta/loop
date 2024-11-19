import { logout } from './logout'

import { describe, expect, test, vi, type Mock } from 'vitest'
import axios from 'axios'
import { logoutHttpScenarios } from '../../test/scenarios'

// Mock axios
vi.mock('axios')

describe('logout', () => {
  describe('Successful logout', () => {
    test('logout user', async () => {
      ;(axios.post as Mock).mockResolvedValueOnce(logoutHttpScenarios.logout())

      await expect(logout()).resolves.toBeUndefined()
      expect(axios.post).toHaveBeenCalledWith('/logout/')
    })
  })

  describe('CSRF Token Validation', () => {
    test('handles missing csrf token', async () => {
      const error = logoutHttpScenarios.missingCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(logout()).rejects.toEqual(error)
    })

    test('handles invalid csrf token', async () => {
      const error = logoutHttpScenarios.invalidCsrf()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(logout()).rejects.toEqual(error)
    })

    test('handles incorrect CSRF token length', async () => {
      const error = logoutHttpScenarios.invalidCsrfLength()
      ;(axios.post as Mock).mockRejectedValueOnce(error)

      await expect(logout()).rejects.toEqual(error)
    })
  })
})
