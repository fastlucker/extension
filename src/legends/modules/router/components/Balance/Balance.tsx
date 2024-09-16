import React from 'react'
import usePortfolioControllerState from '@legends/hooks/usePortfolioControllerState/usePortfolioControllerState'
import formatDecimals from '@common/utils/formatDecimals'

const Balance = () => {
  const { accountPortfolio } = usePortfolioControllerState()

  const balance = formatDecimals(accountPortfolio.totalAmount, 'price')

  // There is no connected account
  if (!accountPortfolio.address) return <div />

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        <strong>Address</strong>: {accountPortfolio.address}
      </div>
      <div style={{ display: 'flex' }}>
        <strong>Balance</strong>: {accountPortfolio.isAllReady ? `${balance}` : 'Loading ...'}
      </div>
    </div>
  )
}

export default Balance
