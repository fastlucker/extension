import React from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useGnosis from '@modules/common/hooks/useGnosis'
import useNetwork from '@modules/common/hooks/useNetwork'
import GnosisSafeAppIframe from '@modules/swap/components/GnosisSafeAppIframe'

const ambireSushiConfig = {
  name: 'Ambire swap',
  url: 'https://sushiswap-interface-ten.vercel.app/swap',
  logo: 'https://www.ambire.com/ambire-logo.png',
  desc: 'Ambire swap'
}

const SwapScreen = () => {
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const { connect, disconnect } = useGnosis()

  return (
    <GnosisSafeAppIframe
      network={network}
      selectedAcc={selectedAcc}
      gnosisConnect={connect}
      gnosisDisconnect={disconnect}
      selectedApp={ambireSushiConfig}
      title="Ambire swap"
    />
  )
}

export default SwapScreen
