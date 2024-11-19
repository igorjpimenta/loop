import type { User } from '../../../context/user-context'
import { createFactory } from './factory-builder'

export const userFactory = createFactory<User>(
  {
    id: 'user',
    username: 'User',
    email: 'user@example.com',
  },
  ['id', 'username', 'email']
)
