import type { LegacyRef, MutableRefObject } from 'react'

export function mergeRefs<T>(...refs: LegacyRef<T>[]) {
  return (element: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(element)
      }

      if (ref) {
        try {
          ;(ref as MutableRefObject<T>).current = element
        } catch (error) {
          console.warn('Attempted to assign to a read-only ref:', ref)
        }
      }
    }
  }
}
