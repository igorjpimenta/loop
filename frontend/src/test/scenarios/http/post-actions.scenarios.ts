import { httpFactory, authenticatedContext, HttpStatus } from '../../factories'

import type { AxiosResponse } from 'axios'
import { httpScenarios } from './http.scenarios'

export const createCommentHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),

  missingContent: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      {
        content: ['This field is required.'],
      },
      authenticatedContext
    ),

  commentCreated: (data: AxiosResponse['data'] = {}) =>
    httpFactory.buildResponse(data),
}

export const deleteCommentHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),
  unauthorized: () => httpScenarios.unauthorized(),

  nonExistentComment: () =>
    httpScenarios.notFound('No Comment matches the given query.'),

  commentDeleted: () => ({}),
}

export const downvotePostHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),

  nonExistentPost: () =>
    httpScenarios.notFound('No Post matches the given query.'),

  alreadyDownvoted: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      { detail: 'You have already downvoted this post.' },
      authenticatedContext
    ),

  downvoted: (data: AxiosResponse['data'] = {}) =>
    httpFactory.buildResponse(data),
}

export const upvotePostHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),

  nonExistentPost: () =>
    httpScenarios.notFound('No Post matches the given query.'),

  alreadyUpvoted: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      { detail: 'You have already upvoted this post.' },
      authenticatedContext
    ),

  upvoted: (data: AxiosResponse['data'] = {}) =>
    httpFactory.buildResponse(data),
}

export const savePostHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),

  alreadySaved: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      { detail: 'You have already saved this post.' },
      authenticatedContext
    ),

  saved: (data: AxiosResponse['data'] = {}) => httpFactory.buildResponse(data),
}

export const unsavePostHttpScenarios = {
  missingCsrf: () => httpScenarios.missingCsrf(),
  invalidCsrf: () => httpScenarios.invalidCsrf(),
  invalidCsrfLength: () => httpScenarios.invalidCsrfLength(),

  notSaved: () =>
    httpFactory.buildError(
      'Bad Request',
      HttpStatus.BAD_REQUEST,
      { detail: 'You have not saved this post.' },
      authenticatedContext
    ),

  unsaved: (data: AxiosResponse['data'] = {}) =>
    httpFactory.buildResponse(data),
}
