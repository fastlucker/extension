import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import LatticeManager from '@web/modules/accounts-importer/components/LatticeManager'
import LedgerManager from '@web/modules/accounts-importer/components/LedgerManager'
import LegacyImportManager from '@web/modules/accounts-importer/components/LegacyImportManager'
import TrezorManager from '@web/modules/accounts-importer/components/TrezorManager'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import { AccountsPaginationProvider } from '@web/modules/accounts-importer/contexts/accountsPaginationContext'
import { HARDWARE_WALLETS } from '@web/modules/hardware-wallet/constants/common'
import useHardwareWallets from '@web/modules/hardware-wallet/hooks/useHardwareWallets'

import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'

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
  [HARDWARE_WALLETS.GRIDPLUS]: LatticeManager,
  LEGACY_IMPORTER: LegacyImportManager
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

  const isLegacyImport = walletType === 'LEGACY_IMPORTER'

  // useEffect(() => {
  //   if (!walletType) {
  //     goBack()
  //   }
  // }, [goBack, walletType])

  if (isLedger || isTrezor || isGrid || isLegacyImport) {
    const closeConnect = React.useCallback(() => {
      try {
        hardwareWallets[walletType].cleanUp()
      } catch (e) {
        console.log(e)
      }
    }, [hardwareWallets, walletType])

    useEffect(() => {
      window.addEventListener('beforeunload', () => {
        if (!isLegacyImport) {
          closeConnect()
        }
      })

      return () => {
        if (!isLegacyImport) {
          closeConnect()
        }
      }
    }, [closeConnect, isLegacyImport])

    const WalletManager = WALLET_MAP[walletType]
    const name = walletType
    const title =
      isLedger || isTrezor || isGrid ? 'Import Account From {{name}}' : 'Import Legacy Accounts'

    return (
      <AccountsPaginationProvider>
        <AuthLayoutWrapperMainContent pageTitle={t(title, { name })}>
          <View style={[spacings.mh, spacings.pv, flexbox.justifyCenter]}>
            <WalletManager />
          </View>
        </AuthLayoutWrapperMainContent>
        <AuthLayoutWrapperSideContent backgroundType="beta">
          <Text
            shouldScale={false}
            fontSize={16}
            style={[spacings.mb]}
            color={colors.zircon}
            weight="medium"
          >
            {t('Importing accounts')}
          </Text>
          <Text
            shouldScale={false}
            fontSize={14}
            style={[spacings.mbMd]}
            color={colors.zircon}
            weight="regular"
          >
            {t(
              'Here you can choose which accounts to import. For every individual key, there exists both a legacy account and a smart account that you can individually choose to import.'
            )}
          </Text>
          <Text
            shouldScale={false}
            fontSize={16}
            color={colors.turquoise}
            style={[spacings.mb]}
            weight="regular"
          >
            {t('Linked Smart Accounts')}
          </Text>
          <Text shouldScale={false} fontSize={14} color={colors.turquoise} weight="regular">
            {t(
              'Linked smart accounts are accounts that were not created with a given key originally, but this key was authorized for that given account on any supported network.'
            )}
          </Text>
        </AuthLayoutWrapperSideContent>
      </AccountsPaginationProvider>
    )
  }

  // TODO: implement a logic for displaying a list of Ambire Smart Accounts and EOA
}

export default AccountsImporterScreen
