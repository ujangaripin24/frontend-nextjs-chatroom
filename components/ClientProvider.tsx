'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib'

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider store={store}>{children}</Provider>
}