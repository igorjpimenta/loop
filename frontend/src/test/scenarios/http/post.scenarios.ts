import { httpFactory, authenticatedContext, HttpStatus } from '../../factories'
import { httpScenarios } from './http.scenarios'

import type { AxiosResponse } from 'axios'

export const deletePostHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),
  unauthorized: () => httpScenarios.unauthorized(),

  nonExistentPost: () =>
    httpScenarios.notFound('No Post matches the given query.'),

  postDeleted: (data: AxiosResponse['data'] = {}) =>
    httpFactory.buildResponse(data),
}

export const createPostHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),

  oneOfEach: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        user_id: ['This field is required.'],
        content: ['This field is required.'],
        topics: ['At least one topic is required.'],
      },
      authenticatedContext
    ),

  missingUserId: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        user_id: ['This field is required.'],
      },
      authenticatedContext
    ),

  missingContent: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        content: ['This field is required.'],
      },
      authenticatedContext
    ),

  missingTopics: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        topics: ['At least one topic is required.'],
      },
      authenticatedContext
    ),

  nonExistentPost: () =>
    httpScenarios.notFound('No Post matches the given query.'),

  unauthorized: () => httpScenarios.unauthorized(),

  postCreated: (data: AxiosResponse['data'] = {}) =>
    httpFactory.buildResponse(data),
}
