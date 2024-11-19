import { emailRegex } from '../../../utils/regex'
import type {
  Factory,
  DeepMerge,
  DeepPartial,
} from '../../../types/test-factory'

export function createFactory<T extends object>(
  defaultAttributes: T,
  iterableAttributes: (keyof T)[]
): Factory<T> {
  const build = (overrides: DeepPartial<T> = {}, index?: number): T => {
    const mergeParams = {
      target: defaultAttributes,
      source: overrides,
    }

    if (index !== undefined && iterableAttributes !== undefined) {
      Object.assign(mergeParams, { index, iterableAttributes })
    }

    return deepMerge(mergeParams)
  }

  const buildList = (count: number, overrides: DeepPartial<T> = {}): T[] => {
    return Array.from({ length: count }, (_, index) =>
      build(overrides, index + 1)
    )
  }

  return { build, buildList }
}

function deepMerge<T extends object>({
  target,
  source,
  iterableAttributes,
  index,
}: DeepMerge<T>): T {
  const output = { ...target }

  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source) as (keyof T)[]) {
      if (key in target) {
        if (isObject(source[key]) && isObject(target[key])) {
          output[key] = deepMerge({
            target: target[key],
            source: source[key],
          })
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      }
    }

    if (iterableAttributes && index !== undefined) {
      for (const key of iterableAttributes) {
        if (key in output) {
          const value = output[key]

          if (typeof value === 'string') {
            if (emailRegex.test(value)) {
              Object.assign(output, { [key]: value.replace('@', `${index}@`) })
            } else {
              Object.assign(output, { [key]: `${value}${index}` })
            }
          }
        }
      }
    }
  }

  return output
}

function isObject(item: unknown): item is object {
  return !!item && typeof item === 'object' && !Array.isArray(item)
}
