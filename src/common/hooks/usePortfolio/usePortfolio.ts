import { useContext } from 'react'

import { PortfolioContext } from '@common/contexts/portfolioContext'

export default function usePortfolio() {
  const context = useContext(PortfolioContext)

  if (!context) {
    throw new Error('usePortfolio must be used within an PortfolioProvider')
  }

  return context
}
