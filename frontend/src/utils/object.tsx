import type { SnakeizeKeys, CamelizeKeys } from '../types/case'

type SnakeizeObject<T> = T extends object
  ? SnakeizeKeys<T>
  : T extends Array<infer U>
    ? SnakeizeKeys<U>[]
    : T

export function snakeizeObject<T>(obj: T): SnakeizeObject<T> {
  if (Array.isArray(obj)) {
    return obj.map(snakeizeObject) as SnakeizeObject<T>
  }

  if (typeof obj !== 'object' || obj === null) {
    return obj as SnakeizeObject<T>
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`),
      snakeizeObject(value),
    ])
  ) as SnakeizeObject<T>
}

type CamelizeObject<T> = T extends object
  ? CamelizeKeys<T>
  : T extends Array<infer U>
    ? CamelizeKeys<U>[]
    : T

export function camelizeObject<T>(obj: T): CamelizeObject<T> {
  if (Array.isArray(obj)) {
    return obj.map(camelizeObject) as CamelizeObject<T>
  }

  if (typeof obj !== 'object' || obj === null) {
    return obj as CamelizeObject<T>
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      camelizeObject(value),
    ])
  ) as CamelizeObject<T>
}
