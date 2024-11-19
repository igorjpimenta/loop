import type { Comment } from '../../../http/post-actions/get-comments'
import { createFactory } from './factory-builder'
import { userFactory } from './user.factory'

export const commentFactory = createFactory<Comment>(
  {
    id: 'comment',
    postId: 'post1',
    user: userFactory.build(),
    content: 'This is a test comment ',
    image: undefined,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  ['id', 'content']
)
