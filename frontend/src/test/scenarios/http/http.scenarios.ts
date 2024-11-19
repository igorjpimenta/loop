import { httpFactory, authenticatedContext, HttpStatus } from '../../factories'

export const httpScenarios = {
  loading: () => new Promise(() => {}),

  missingCsrf: () =>
    httpFactory.buildError(
      'CSRF Failed',
      HttpStatus.FORBIDDEN,
      {
        detail: 'CSRF Failed: CSRF token missing.',
      },
      {}
    ),

  invalidCsrf: () =>
    httpFactory.buildError(
      'CSRF Failed',
      HttpStatus.FORBIDDEN,
      {
        detail:
          "CSRF Failed: CSRF token from the 'X-Csrftoken' HTTP header incorrect.",
      },
      {
        csrfToken: 'invalid-token-that-have-32-char-',
      }
    ),

  invalidCsrfLength: () =>
    httpFactory.buildError(
      'CSRF Failed',
      HttpStatus.FORBIDDEN,
      {
        detail:
          "CSRF Failed: CSRF token from the 'X-Csrftoken' HTTP header has incorrect length.",
      },
      {
        csrfToken: 'short-token',
      }
    ),

  missingSessionCookie: () =>
    httpFactory.buildError(
      'CSRF Failed',
      HttpStatus.FORBIDDEN,
      {
        detail: 'Authentication credentials were not provided.',
      },
      {
        csrfToken: authenticatedContext.csrfToken,
        cookies: {},
      }
    ),

  unauthorized: () =>
    httpFactory.buildError(
      'Forbidden',
      HttpStatus.FORBIDDEN,
      {
        detail: 'You do not have permission to perform this action.',
      },
      authenticatedContext
    ),

  notFound: (detail = 'Not found.') =>
    httpFactory.buildError(
      'Not Found',
      HttpStatus.NOT_FOUND,
      {
        detail,
      },
      authenticatedContext
    ),

  internalServerError: () =>
    httpFactory.buildError(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        detail: 'An internal server error occurred.',
      },
      authenticatedContext
    ),
}
