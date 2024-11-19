import { snakeizeObject, camelizeObject } from './object'

import { describe, test, expect } from 'vitest'

describe('snakeizeObject', () => {
  test('should handle primitive values', () => {
    // Test for cases where the value is not an object
    expect(snakeizeObject('firstString')).toBe('firstString')
    expect(snakeizeObject(123)).toBe(123)
    expect(snakeizeObject(null)).toBe(null)
    expect(snakeizeObject(undefined)).toBe(undefined)
  })

  test('should convert simple object keys to snake_case', () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com',
    }

    const expected = {
      first_name: 'John',
      last_name: 'Doe',
      email_address: 'john@example.com',
    }

    expect(snakeizeObject(input)).toEqual(expected)
  })

  test('should handle nested objects', () => {
    const input = {
      userInfo: {
        firstName: 'John',
        lastName: 'Doe',
        contactDetails: {
          emailAddress: 'john@example.com',
          phoneNumber: '1234567890',
        },
      },
    }

    const expected = {
      user_info: {
        first_name: 'John',
        last_name: 'Doe',
        contact_details: {
          email_address: 'john@example.com',
          phone_number: '1234567890',
        },
      },
    }

    expect(snakeizeObject(input)).toEqual(expected)
  })

  test('should handle arrays of objects', () => {
    const input = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
    ]

    const expected = [
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Smith' },
    ]

    expect(snakeizeObject(input)).toEqual(expected)
  })

  test('should handle complex nested structures', () => {
    const input = {
      userList: [
        {
          userId: 1,
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
          },
          contactDetails: [
            { emailAddress: 'john@example.com' },
            { phoneNumber: '1234567890' },
          ],
        },
      ],
    }

    const expected = {
      user_list: [
        {
          user_id: 1,
          personal_info: {
            first_name: 'John',
            last_name: 'Doe',
          },
          contact_details: [
            { email_address: 'john@example.com' },
            { phone_number: '1234567890' },
          ],
        },
      ],
    }

    expect(snakeizeObject(input)).toEqual(expected)
  })
})

describe('camelizeObject', () => {
  test('should handle primitive values', () => {
    expect(camelizeObject('first_string')).toBe('first_string')
    expect(camelizeObject(123)).toBe(123)
    expect(camelizeObject(null)).toBe(null)
    expect(camelizeObject(undefined)).toBe(undefined)
  })

  test('should convert simple object keys to camelCase', () => {
    const input = {
      first_name: 'John',
      last_name: 'Doe',
      email_address: 'john@example.com',
    }

    const expected = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com',
    }

    expect(camelizeObject(input)).toEqual(expected)
  })

  test('should handle nested objects', () => {
    const input = {
      user_info: {
        first_name: 'John',
        last_name: 'Doe',
        contact_details: {
          email_address: 'john@example.com',
          phone_number: '1234567890',
        },
      },
    }

    const expected = {
      userInfo: {
        firstName: 'John',
        lastName: 'Doe',
        contactDetails: {
          emailAddress: 'john@example.com',
          phoneNumber: '1234567890',
        },
      },
    }

    expect(camelizeObject(input)).toEqual(expected)
  })

  test('should handle arrays of objects', () => {
    const input = [
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Smith' },
    ]

    const expected = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
    ]

    expect(camelizeObject(input)).toEqual(expected)
  })

  test('should handle complex nested structures', () => {
    const input = {
      user_list: [
        {
          user_id: 1,
          personal_info: {
            first_name: 'John',
            last_name: 'Doe',
          },
          contact_details: [
            { email_address: 'john@example.com' },
            { phone_number: '1234567890' },
          ],
        },
      ],
    }

    const expected = {
      userList: [
        {
          userId: 1,
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
          },
          contactDetails: [
            { emailAddress: 'john@example.com' },
            { phoneNumber: '1234567890' },
          ],
        },
      ],
    }

    expect(camelizeObject(input)).toEqual(expected)
  })
})
