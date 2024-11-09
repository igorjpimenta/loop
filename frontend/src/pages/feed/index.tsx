import { Header } from './sections/header'
import { Posts } from './components/posts'

export function Feed() {
  return (
    <div className="flex flex-col gap-3 pb-6">
      <Header />

      <Posts />
    </div>
  )
}
