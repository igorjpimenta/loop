import { mergeRefs } from './dom'

import type { MutableRefObject } from 'react'
import { describe, test, expect, vi } from 'vitest'

describe('mergeRefs', () => {
  test('should call multiple function refs with the same element', () => {
    // Test for calling multiple function refs
    const ref1 = vi.fn()
    const ref2 = vi.fn()
    const element = {}

    const mergedRef = mergeRefs(ref1, ref2)
    mergedRef(element)

    expect(ref1).toHaveBeenCalledWith(element)
    expect(ref2).toHaveBeenCalledWith(element)
  })

  test('should assign to multiple mutable refs', () => {
    // Test for assigning to multiple mutable refs
    const ref1 = { current: null } as MutableRefObject<unknown>
    const ref2 = { current: null } as MutableRefObject<unknown>
    const element = {}

    const mergedRef = mergeRefs(ref1, ref2)
    mergedRef(element)

    expect(ref1.current).toBe(element)
    expect(ref2.current).toBe(element)
  })

  test('should handle mixed refs (function and mutable)', () => {
    // Test for handling mixed refs
    const ref1 = vi.fn()
    const ref2 = { current: null } as MutableRefObject<unknown>
    const element = {}

    const mergedRef = mergeRefs(ref1, ref2)
    mergedRef(element)

    expect(ref1).toHaveBeenCalledWith(element)
    expect(ref2.current).toBe(element)
  })

  test('should handle read-only refs gracefully', () => {
    // Test for handling read-only refs
    const ref1 = { current: null } as MutableRefObject<unknown>
    const readOnlyRef = Object.freeze({ current: null }) // Read-only ref
    const element = {}

    const mergedRef = mergeRefs(ref1, readOnlyRef)
    mergedRef(element)

    expect(ref1.current).toBe(element) // Should assign to mutable ref
    expect(readOnlyRef.current).toBe(null) // Should not change read-only ref
  })

  test('should handle no refs gracefully', () => {
    // Test for handling no refs
    const mergedRef = mergeRefs()
    expect(() => mergedRef({})).not.toThrow() // Should not throw an error
  })
})
