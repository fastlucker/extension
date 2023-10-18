import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
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
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useAccountAdder from '@web/modules/account-adder/hooks/useAccountAdder/useAccountAdder'

const hwDeviceNames: { [key in Exclude<Key['type'], 'internal'>]: string } = {
  ledger: 'Ledger',
  trezor: 'Trezor',
  lattice: 'GridPlus Lattice1'
}

export interface Account {
  type: string
  address: string
  brandName: string
  alianName?: string
  displayBrandName?: string
  index?: number
  balance?: number
}

const AccountAdderScreen = () => {
  const { params } = useRoute()
  const { goBack } = useNavigation()
  const { t } = useTranslation()
  const accountAdderState = useAccountAdderControllerState()

  const { keyType, privKeyOrSeed, label } = params as {
    keyType: Key['type']
    privKeyOrSeed?: string
    label?: string
  }

  const { onImportReady, setPage } = useAccountAdder({
    keyType,
    privKeyOrSeed,
    keyLabel: label
  })

  useEffect(() => {
    if (!keyType) goBack()
  }, [keyType, goBack])

  return (
    <>
      <TabLayoutWrapperMainContent>
        <Text weight="medium" fontSize={16} style={[flexbox.alignSelfCenter]}>
          {keyType === 'internal'
            ? t('Pick Accounts To Import')
            : t('Import Account From {{ hwDeviceName }}', { hwDeviceName: hwDeviceNames[keyType] })}
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

        {keyType === 'internal' && (
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
