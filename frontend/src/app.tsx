import { Feed } from './pages/feed'
import { queryClient } from './lib/react-query'
import { UserProvider } from './context/user-context'

import { QueryClientProvider } from '@tanstack/react-query'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Feed />
      </UserProvider>
    </QueryClientProvider>
  )
}
