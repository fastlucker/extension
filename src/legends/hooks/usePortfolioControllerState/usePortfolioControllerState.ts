import { useContext } from 'react'

import { PortfolioControllerStateContext } from '@legends/contexts/portfolioControllerStateContext'

export default function usePortfolioControllerState() {
  const context = useContext(PortfolioControllerStateContext)

  if (!context) {
    throw new Error(
      'usePortfolioControllerState must be used within a PortfolioControllerStateContext'
    )
  }

  return context
}
