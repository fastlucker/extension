import React from 'react'
import { View } from 'react-native'

import Spinner from '@common/components/Spinner'
import Title from '@common/components/Title'
import LedgerManager from '@web/modules/accounts-importer/components/LedgerManager'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'

// import { TrezorManager } from './TrezorManager'

const MANAGER_MAP = {
  [HARDWARE_WALLETS.LEDGER]: LedgerManager
  // [HARDWARE_WALLETS.TREZOR]: TrezorManager
}

const HDManager = ({ walletType }) => {
  const { hardwareWallets } = useHardwareWallets()
  const [initialed, setInitialed] = React.useState(true)
  const idRef = React.useRef<number | null>(null)

  const closeConnect = React.useCallback(() => {
    hardwareWallets[walletType].cleanUp()
  }, [])

  // React.useEffect(() => {

  //   wallet
  //     .connectHardware({
  //       type: keyring,
  //       isWebHID: true
  //     })
  //     .then((id) => {
  //       idRef.current = id
  //       setInitialed(true)
  //     })

  //   window.addEventListener('beforeunload', () => {
  //     closeConnect()
  //   })

  //   return () => {
  //     closeConnect()
  //   }
  // }, [])

  if (!initialed) {
    return <Spinner />
  }

  const Manager = MANAGER_MAP[walletType]
  const name = walletType

  return (
    <View>
      <Title>Connected to {name}</Title>
      <Manager />
    </View>
  )
}

export default HDManager
