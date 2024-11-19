import { httpFactory, authenticatedContext, HttpStatus } from '../../factories'
import { httpScenarios } from './http.scenarios'

import type { AxiosResponse } from 'axios'

export const registerHttpScenarios = {
  loading: () => httpScenarios.loading(),
  internalServerError: () => httpScenarios.internalServerError(),

  oneOfEach: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        username: ['user with this username already exists.'],
        email: ['user with this email already exists.'],
        password: ['This password is too common.'],
      },
      authenticatedContext
    ),

  usernameTaken: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        username: ['user with this username already exists.'],
      },
      authenticatedContext
    ),

  emailTaken: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        email: ['user with this email already exists.'],
      },
      authenticatedContext
    ),

  invalidEmail: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        email: ['Enter a valid email address.'],
      },
      authenticatedContext
    ),

  shortPassword: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        password: [
          'This password is too short. It must contain at least 8 characters.',
        ],
      },
      authenticatedContext
    ),

  numericPassword: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        password: ['This password is entirely numeric.'],
      },
      authenticatedContext
    ),

  commonPassword: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        password: ['This password is too common.'],
      },
      authenticatedContext
    ),
}

export const loginHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),
  loading: () => httpScenarios.loading(),
  internalServerError: () => httpScenarios.internalServerError(),

  invalidCredentials: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        non_field_errors: ['Invalid username or password.'],
      },
      authenticatedContext
    ),
}

export const logoutHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),

  logout: (data: AxiosResponse['data'] = {}) => httpFactory.buildResponse(data),
}
