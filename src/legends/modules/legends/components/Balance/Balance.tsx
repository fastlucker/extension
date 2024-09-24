import React from 'react'

import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'

const Balance = () => {
  const { accountPortfolio } = usePortfolioControllerState()

  // There is no connected account
  if (!accountPortfolio) return null

  // TODO: Styles
  return (
    <div style={{ display: 'flex' }}>
      <strong>Balance</strong>:{' '}
      {accountPortfolio.isReady
        ? accountPortfolio.amountFormatted
        : accountPortfolio.error || 'Loading...'}
    </div>
  )
}

export default Balance
