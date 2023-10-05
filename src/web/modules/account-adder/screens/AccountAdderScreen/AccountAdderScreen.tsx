import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
// import LatticeManager from '@web/modules/account-adder/components/LatticeManager'
// import LedgerManager from '@web/modules/account-adder/components/LedgerManager'
// import LegacyImportManager from '@web/modules/account-adder/components/LegacyImportManager'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useAccountAdder from '@web/modules/account-adder/hooks/useAccountAdder/useAccountAdder'

export interface Account {
  type: string
  address: string
  brandName: string
  alianName?: string
  displayBrandName?: string
  index?: number
  balance?: number
}

// const WALLET_MAP = {
//   [HARDWARE_WALLETS.LEDGER]: LedgerManager,
//   [HARDWARE_WALLETS.TREZOR]: TrezorManager,
//   [HARDWARE_WALLETS.LATTICE]: LatticeManager,
//   legacyImport: LegacyImportManager
// }

const AccountAdderScreen = () => {
  const { params } = useRoute()
  const { goBack } = useNavigation()
  const { t } = useTranslation()
  const accountAdderState = useAccountAdderControllerState()

  const { walletType, privKeyOrSeed, label }: any = params

  const { onImportReady, setPage } = useAccountAdder({
    stepperFlow: walletType === 'legacy' ? 'legacy' : 'hw',
    type: walletType,
    privKeyOrSeed,
    keyLabel: label
  })

  // const isLattice = walletType === HARDWARE_WALLETS.LATTICE
  // const isLedger = walletType === HARDWARE_WALLETS.LEDGER
  // const isTrezor = walletType === HARDWARE_WALLETS.TREZOR

  const isLegacyImport = walletType === 'legacy'

  useEffect(() => {
    if (!walletType) goBack()
  }, [walletType, goBack])

  // const WalletManager: any = WALLET_MAP[walletType]
  // let walletManagerProps = {}
  // const name = walletType
  // let title = ''
  // if (isLedger || isTrezor || isLattice) {
  //   title = 'Import Account From {{name}}'
  //   walletManagerProps = {}
  // }
  // if (isLegacyImport) {
  //   title = 'Pick Accounts To Import'
  //   walletManagerProps = { privKeyOrSeed, label }
  // }

  return (
    <>
      <TabLayoutWrapperMainContent>
        <Text weight="medium" fontSize={16} style={[flexbox.alignSelfCenter]}>
          {walletType === 'legacy'
            ? t('Pick Accounts To Import')
            : t('Import Account From {{ walletType }}', { walletType })}
        </Text>
        <View style={[spacings.mh, spacings.pv, flexbox.justifyCenter]}>
          <AccountsOnPageList
            isSubmitting={accountAdderState.addAccountsStatus === 'LOADING'}
            state={accountAdderState}
            onImportReady={onImportReady}
            setPage={setPage}
          />
        </View>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent backgroundType="beta">
        <Text fontSize={16} style={[spacings.mb]} color={colors.zircon} weight="medium">
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
        <Text fontSize={16} color={colors.turquoise} style={[spacings.mb]} weight="regular">
          {t('Linked Smart Accounts')}
        </Text>
        <Text
          shouldScale={false}
          fontSize={14}
          color={colors.turquoise}
          weight="regular"
          style={[spacings.mbMd]}
        >
          {t(
            'Linked smart accounts are accounts that were not created with a given key originally, but this key was authorized for that given account on any supported network.'
          )}
        </Text>

        {isLegacyImport && (
          <>
            <Text fontSize={16} style={[spacings.mb]} weight="regular" color={colors.zircon}>
              {t('Email Recovery')}
            </Text>
            <Text shouldScale={false} fontSize={14} weight="regular" color={colors.zircon}>
              {t(
                "Email recovery can be enabled for Smart Accounts, and it allows you to use your email vault to trigger a timelocked recovery procedure that enables you to regain access to an account if you've lost it's keys."
              )}
            </Text>
          </>
        )}
      </TabLayoutWrapperSideContent>
    </>
  )
}

export default AccountAdderScreen
