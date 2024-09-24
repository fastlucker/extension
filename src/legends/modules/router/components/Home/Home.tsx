import React from 'react'

import Sidebar from '@legends/components/Sidebar'
import Balance from '@legends/modules/router/components/Balance'
import WalletConnect from '@legends/modules/router/components/WalletConnect'

const Home = () => {
  return (
    <div>
      <Sidebar />
      <WalletConnect />
      <Balance />
    </div>
  )
}

export default Home
