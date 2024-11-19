import type { Post } from '../../../http/posts/get-posts'
import type { DeepPartial } from '../../../types/test-factory'
import { postFactory, commentFactory } from '../../factories'
import { userScenarios } from './user.scenarios'

export const postScenarios = {
  standardPost: (overrides?: DeepPartial<Post>) => ({
    post: postFactory.build({
      id: 'post',
      content: 'Standard post',
      actions: {
        votes: 5,
        comments: 1,
        isUpvoted: true,
        isDownvoted: false,
        isSaved: false,
      },
      ...overrides,
    }),
    comments: commentFactory.buildList(1, { postId: 'post1' }),
  }),

  postWithoutImage: (overrides?: DeepPartial<Post>) => ({
    post: postFactory.build({
      content: 'No image post',
      image: undefined,
      ...overrides,
    }),
  }),

  postWithImage: (overrides?: DeepPartial<Post>) => ({
    post: postFactory.build({
      content: 'Image post',
      image: 'image.jpg',
      ...overrides,
    }),
  }),

  savedPost: (overrides?: DeepPartial<Post>) => ({
    post: postFactory.build({
      content: 'Saved post',
      actions: {
        isSaved: true,
      },
      ...overrides,
    }),
  }),

  upvotedPost: (overrides?: DeepPartial<Post>) => ({
    post: postFactory.build({
      content: 'Upvoted post',
      actions: {
        votes: 1,
        isUpvoted: true,
      },
      ...overrides,
    }),
  }),

  downvotedPost: (overrides?: DeepPartial<Post>) => ({
    post: postFactory.build({
      content: 'Downvoted post',
      actions: {
        votes: -1,
        isDownvoted: true,
      },
      ...overrides,
    }),
  }),

  postWithoutEngagement: (overrides?: DeepPartial<Post>) => ({
    post: postFactory.build({
      content: 'Post without engagement',
      actions: {
        votes: 0,
        comments: 0,
        isUpvoted: false,
        isDownvoted: false,
        isSaved: false,
      },
      ...overrides,
    }),
  }),

  multipleUserPosts: (overrides?: DeepPartial<Post>) => {
    const { user, anotherUser } = userScenarios
    const posts = [
      postFactory.build({ ...overrides, user }, 1),
      postFactory.build({ ...overrides, user: anotherUser }, 2),
    ]

    return { users: [user, anotherUser], posts }
  },

  // postWithHighEngagement: () => ({
  //   post: postFactory.build({
  //     actions: {
  //       votes: 100,
  //       comments: 50,
  //       isUpvoted: true,
  //       isDownvoted: false,
  //       isSaved: true,
  //     },
  //   }),
  //   user: userFactory.build({ username: 'popular_user' }),
  // }),

  // postWithManyComments: () => ({
  //   post: postFactory.build({
  //     actions: { comments: 5 },
  //   }),
  //   comments: commentFactory.buildList(5),
  // }),

  // postWithAllFeatures: () => ({
  //   post: postFactory.build({
  //     content: 'Full featured post',
  //     image: 'image.jpg',
  //     topics: topicFactory.buildList(3),
  //     actions: {
  //       votes: 10,
  //       comments: 5,
  //       isUpvoted: true,
  //       isDownvoted: false,
  //       isSaved: true,
  //     },
  //   }),
  //   comments: commentFactory.buildList(5),
  // }),
}
