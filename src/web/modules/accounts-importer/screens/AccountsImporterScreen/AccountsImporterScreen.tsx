import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Title from '@common/components/Title'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import LatticeManager from '@web/modules/accounts-importer/components/LatticeManager'
import LedgerManager from '@web/modules/accounts-importer/components/LedgerManager'
import TrezorManager from '@web/modules/accounts-importer/components/TrezorManager'
import { AccountsPaginationProvider } from '@web/modules/accounts-importer/contexts/accountsPaginationContext'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'

export interface Account {
  type: string
  address: string
  brandName: string
  alianName?: string
  displayBrandName?: string
  index?: number
  balance?: number
}

const WALLET_MAP = {
  [HARDWARE_WALLETS.LEDGER]: LedgerManager,
  [HARDWARE_WALLETS.TREZOR]: TrezorManager,
  [HARDWARE_WALLETS.GRIDPLUS]: LatticeManager
}

const AccountsImporterScreen = () => {
  const { params } = useRoute()

  const { goBack } = useNavigation()
  const { hardwareWallets } = useHardwareWallets()
  const { t } = useTranslation()

  const { walletType }: any = params

  const isGrid = walletType === HARDWARE_WALLETS.GRIDPLUS
  const isLedger = walletType === HARDWARE_WALLETS.LEDGER
  const isTrezor = walletType === HARDWARE_WALLETS.TREZOR

  // useEffect(() => {
  //   if (!walletType) {
  //     goBack()
  //   }
  // }, [goBack, walletType])

  if (isLedger || isTrezor || isGrid) {
    const closeConnect = React.useCallback(() => {
      try {
        hardwareWallets[walletType].cleanUp()
      } catch (e) {
        console.log(e)
      }
    }, [hardwareWallets, walletType])

    useEffect(() => {
      window.addEventListener('beforeunload', () => {
        closeConnect()
      })

      return () => {
        closeConnect()
      }
    }, [closeConnect])

    const WalletManager = WALLET_MAP[walletType]
    const name = walletType

    return (
      <AccountsPaginationProvider>
        <View style={[spacings.mh, spacings.pv]}>
          <Title>{t('Connected to a {{name}} hardware device', { name })}</Title>
          <WalletManager />
        </View>
      </AccountsPaginationProvider>
    )
  }

  // TODO: implement a logic for displaying a list of Ambire Smart Accounts and EOA
}

export default AccountsImporterScreen
