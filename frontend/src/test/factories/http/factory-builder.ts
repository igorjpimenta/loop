import type { HttpFactory, HttpTestContext } from '../../../types/test-factory'

import { AxiosError, type AxiosResponse } from 'axios'

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

const httpStatusText = {
  [HttpStatus.OK]: 'OK',
  [HttpStatus.CREATED]: 'Created',
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
}

export const authenticatedContext: HttpTestContext = {
  csrfToken: 'NNNPfK8Gq96HHWvjl5fqyl05aWdzcw4k',
  cookies: {
    sessionid: 'abc123',
    csrftoken: 'NNNPfK8Gq96HHWvjl5fqyl05aWdzcw4k',
  },
}

export function createHttpFactory(): HttpFactory {
  const buildResponse = (
    data: AxiosResponse['data'],
    context: HttpTestContext = authenticatedContext
  ): AxiosResponse =>
    ({
      data,
      status: HttpStatus.OK,
      statusText: httpStatusText[HttpStatus.OK],
      headers: {
        ...(context?.csrfToken && {
          'X-CSRFToken': context.csrfToken,
        }),
        ...(context?.cookies && {
          Cookie: Object.entries(context.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; '),
        }),
      },
    }) as AxiosResponse

  const buildError = (
    message: string,
    status: HttpStatus,
    data: AxiosResponse['data'],
    context?: HttpTestContext
  ): AxiosError =>
    new AxiosError(message, String(status), undefined, undefined, {
      data,
      status,
      statusText: httpStatusText[status],
      headers: {
        ...(context?.csrfToken && {
          'X-CSRFToken': context.csrfToken,
        }),
        ...(context?.cookies && {
          Cookie: Object.entries(context.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; '),
        }),
      },
    } as AxiosResponse)

  return { buildResponse, buildError }
}
