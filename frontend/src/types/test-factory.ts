import type { HttpStatus } from '../test/factories/http/factory-builder'

import type { AxiosResponse, AxiosError } from 'axios'

export type Factory<T> = {
  build: (overrides?: DeepPartial<T>, index?: number) => T
  buildList: (count: number, overrides?: DeepPartial<T>) => T[]
}

export type DeepMerge<T extends object> = {
  target: T
  source: DeepPartial<T>
} & (
  | { iterableAttributes: (keyof T)[]; index: number }
  | { iterableAttributes?: never; index?: never }
)

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface HttpTestContext {
  csrfToken?: string
  cookies?: Record<string, string>
}

export type HttpFactory = {
  buildResponse: (
    data: AxiosResponse['data'],
    context?: HttpTestContext
  ) => AxiosResponse
  buildError: (
    message: string,
    status: HttpStatus,
    data: AxiosResponse['data'],
    context?: HttpTestContext
  ) => AxiosError
}
