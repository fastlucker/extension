import React from 'react'
import Balance from '@legends/modules/router/components/Balance'
import Character from '@legends/modules/router/components/Character'
import WalletConnect from '@legends/modules/router/components/WalletConnect'

import Sidebar from '@legends/components/Sidebar'

const Home = () => {
  return (
    <div>
      <Sidebar />
      <WalletConnect />
      <Balance />
      <Character />
    </div>
  )
}

export default Home
