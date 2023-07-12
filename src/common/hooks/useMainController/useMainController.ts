import { useContext } from 'react'

import { MainControllerContext } from '@common/contexts/mainControllerContext'

export default function useMainController() {
  const context = useContext(MainControllerContext)

  if (!context) {
    throw new Error('useMainController must be used within an MainControllerProvider')
  }

  return context
}
