import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  tabLayoutWidths,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useAccountAdder from '@web/modules/account-adder/hooks/useAccountAdder/useAccountAdder'
import Stepper from '@web/modules/router/components/Stepper'

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
  const { theme } = useTheme()
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
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content" withBackButton={false} withAmbireLogo>
          <Stepper containerStyle={{ maxWidth: tabLayoutWidths.lg }} />
        </Header>
      }
      footer={
        <View
          style={[
            flexbox.flex1,
            flexbox.justifySpaceBetween,
            flexbox.alignCenter,
            flexbox.directionRow
          ]}
        >
          <TouchableOpacity style={[flexbox.directionRow, flexbox.alignCenter]} onPress={goBack}>
            <LeftArrowIcon width={32} height={32} />
            <Text style={spacings.plTy} fontSize={16} weight="medium" appearance="secondaryText">
              {t('Back')}
            </Text>
          </TouchableOpacity>
          <Button
            style={{ ...spacings.mtTy, width: 296, ...flexbox.alignSelfCenter }}
            onPress={onImportReady}
            disabled={
              accountAdderState.accountsLoading ||
              accountAdderState.addAccountsStatus === 'LOADING' ||
              (!accountAdderState.selectedAccounts.length &&
                !accountAdderState.preselectedAccounts.length)
            }
            text={
              accountAdderState.addAccountsStatus === 'LOADING'
                ? t('Importing...')
                : accountAdderState.preselectedAccounts.length &&
                  !accountAdderState.selectedAccounts.length
                ? t('Continue')
                : t('Import Accounts')
            }
          />
        </View>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel>
          <AccountsOnPageList state={accountAdderState} setPage={setPage} keyType={keyType} />
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
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
        <Text fontSize={16} appearance="successText" style={[spacings.mb]} weight="regular">
          {t('Linked Smart Accounts')}
        </Text>
        <Text
          shouldScale={false}
          fontSize={14}
          appearance="successText"
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
    </TabLayoutContainer>
  )
}

export default AccountAdderScreen
