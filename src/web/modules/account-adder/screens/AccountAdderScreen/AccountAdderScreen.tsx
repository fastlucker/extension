import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Spinner from '@common/components/Spinner'
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
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
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

// TODO:
const showEmailVaultRecoveryToggle = true

const AccountAdderScreen = () => {
  const { params } = useRoute()
  const { goBack } = useNavigation()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const mainControllerState = useMainControllerState()
  const accountAdderState = useAccountAdderControllerState()
  const [enableEmailVaultRecovery, setEnableEmailVaultRecovery] = useState(false)
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
        <Header mode="custom-inner-content" withAmbireLogo>
          <Stepper />
        </Header>
      }
      footer={
        <>
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <TouchableOpacity
              style={[flexbox.directionRow, flexbox.alignCenter, spacings.mr2Xl]}
              onPress={goBack}
            >
              <LeftArrowIcon />
              <Text style={spacings.plTy} fontSize={16} weight="medium" appearance="secondaryText">
                {t('Back')}
              </Text>
            </TouchableOpacity>
            {/* TODO: {!!showEmailVaultRecoveryToggle && (
              <Toggle
                isOn={enableEmailVaultRecovery}
                onToggle={() => setEnableEmailVaultRecovery((p) => !p)}
                label={t('Enable email recovery for new Smart Accounts')}
              />
            )} */}
          </View>
          <View
            style={[
              flexbox.alignCenter,
              spacings.ptSm,
              { opacity: accountAdderState.linkedAccountsLoading ? 1 : 0 }
            ]}
          >
            <View style={[spacings.mbTy, flexbox.alignCenter, flexbox.directionRow]}>
              <Spinner style={{ width: 16, height: 16 }} />
              <Text appearance="primary" style={[spacings.mlSm]} fontSize={12}>
                {t('Looking for linked smart accounts')}
              </Text>
            </View>
          </View>
          <Button
            hasBottomSpacing={false}
            textStyle={{ fontSize: 14 }}
            onPress={onImportReady}
            disabled={
              accountAdderState.accountsLoading ||
              accountAdderState.addAccountsStatus === 'LOADING' ||
              (!accountAdderState.selectedAccounts.length &&
                !accountAdderState.preselectedAccounts.length) ||
              (mainControllerState.status === 'LOADING' &&
                mainControllerState.latestMethodCall === 'onAccountAdderSuccess')
            }
            text={
              accountAdderState.addAccountsStatus === 'LOADING' ||
              (mainControllerState.status === 'LOADING' &&
                mainControllerState.latestMethodCall === 'onAccountAdderSuccess')
                ? t('Importing...')
                : accountAdderState.preselectedAccounts.length &&
                  !accountAdderState.selectedAccounts.length
                ? t('Continue')
                : t('Import Accounts')
            }
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel style={{ maxHeight: '100%' }}>
          <AccountsOnPageList state={accountAdderState} setPage={setPage} keyType={keyType} />
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent>
        <TabLayoutWrapperSideContentItem title="Importing accounts">
          <TabLayoutWrapperSideContentItem.Text>
            Select which accounts to import. For every unique key, you can find a Basic Account and
            a Smart Account, and you can import them individually.
          </TabLayoutWrapperSideContentItem.Text>
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
    </TabLayoutContainer>
  )
}

export default AccountAdderScreen
