import { userFactory } from '../../factories'

export const userScenarios = {
  user: userFactory.build({
    id: 'user1',
    username: 'JohnDoe',
    email: 'john.doe@example.com',
  }),

  anotherUser: userFactory.build({
    id: 'user2',
    username: 'JaneDoe',
    email: 'jane.doe@example.com',
  }),
}
