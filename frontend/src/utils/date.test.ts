import { formatRelativeTime } from './date'

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('formatRelativeTime', () => {
  // Mock the current date to ensure consistent test results
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should return "just now" for timestamps less than 60 seconds ago', () => {
    // Test for a timestamp 30 seconds ago
    const timestamp = new Date('2024-03-15T11:59:30.000Z').toISOString()
    expect(formatRelativeTime(timestamp)).toBe('just now')
  })

  test('should return minutes for timestamps less than an hour ago', () => {
    // Test for a timestamp 30 minutes ago
    const thirtyMinsAgo = new Date('2024-03-15T11:30:00.000Z').toISOString()
    // Test for a timestamp 5 minutes ago
    const fiveMinsAgo = new Date('2024-03-15T11:55:00.000Z').toISOString()

    expect(formatRelativeTime(thirtyMinsAgo)).toBe('30m ago')
    expect(formatRelativeTime(fiveMinsAgo)).toBe('5m ago')
  })

  test('should return hours for timestamps less than 24 hours ago', () => {
    // Test for a timestamp 6 hours ago
    const sixHoursAgo = new Date('2024-03-15T06:00:00.000Z').toISOString()
    // Test for a timestamp 1 hour ago
    const oneHourAgo = new Date('2024-03-15T11:00:00.000Z').toISOString()

    expect(formatRelativeTime(sixHoursAgo)).toBe('6h ago')
    expect(formatRelativeTime(oneHourAgo)).toBe('1h ago')
  })

  test('should return days for timestamps 24 hours or more ago', () => {
    // Test for a timestamp 2 days ago
    const twoDaysAgo = new Date('2024-03-13T12:00:00.000Z').toISOString()
    // Test for a timestamp 5 days ago
    const fiveDaysAgo = new Date('2024-03-10T12:00:00.000Z').toISOString()

    expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago')
    expect(formatRelativeTime(fiveDaysAgo)).toBe('5d ago')
  })

  test('should handle edge cases between time boundaries', () => {
    // Test for a timestamp 59 minutes and 59 seconds ago
    const almostOneHour = new Date('2024-03-15T11:00:01.000Z').toISOString()
    // Test for a timestamp 23 hours and 59 minutes ago
    const almostOneDay = new Date('2024-03-14T12:00:01.000Z').toISOString()

    expect(formatRelativeTime(almostOneHour)).toBe('59m ago')
    expect(formatRelativeTime(almostOneDay)).toBe('23h ago')
  })
})
