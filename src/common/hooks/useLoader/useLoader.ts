import { useContext } from 'react'

import { LoaderContext } from '@common/contexts/loaderContext'

export default function useLoader() {
  const context = useContext(LoaderContext)

  if (!context) {
    throw new Error('useLoader must be used within an LoaderContext')
  }

  return context
}
