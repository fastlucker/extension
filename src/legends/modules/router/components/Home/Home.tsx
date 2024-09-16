import React from 'react'
import Balance from '@legends/modules/router/components/Balance'
import WalletConnect from '@legends/modules/router/components/WalletConnect'

const Home = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <WalletConnect />
      <Balance />
    </div>
  )
}

export default Home
