import type { Post } from '../../../http/posts/get-posts'
import { createFactory } from './factory-builder'
import { userFactory } from './user.factory'
import { topicFactory } from './topic.factory'

export const postFactory = createFactory<Post>(
  {
    id: 'post',
    user: userFactory.build(),
    content: 'This is a test post',
    image: undefined,
    topics: topicFactory.buildList(2),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    actions: {
      votes: 0,
      comments: 0,
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
    },
  },
  ['id', 'content']
)
