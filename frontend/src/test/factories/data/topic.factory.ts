import type { Topic } from '../../../http/posts/get-topics'
import { createFactory } from './factory-builder'

export const topicFactory = createFactory<Topic>(
  {
    id: 'topic',
    name: 'Topic ',
  },
  ['id', 'name']
)
