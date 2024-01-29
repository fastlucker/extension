import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useAccountAdder from '@web/modules/account-adder/hooks/useAccountAdder/useAccountAdder'
import Stepper from '@web/modules/router/components/Stepper'

import { AccountAdderIntroStepsProvider } from '../../contexts/accountAdderIntroStepsContext'

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
  const mainControllerState = useMainControllerState()
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
    <AccountAdderIntroStepsProvider>
      <TabLayoutContainer
        backgroundColor={theme.secondaryBackground}
        width="lg"
        header={
          <Header mode="custom-inner-content" withAmbireLogo>
            <Stepper />
          </Header>
        }
        footer={
          <>
            <BackButton />
            <Button
              hasBottomSpacing={false}
              textStyle={{ fontSize: 14 }}
              onPress={onImportReady}
              size={
                accountAdderState.preselectedAccounts.length &&
                !accountAdderState.selectedAccounts.length
                  ? 'large'
                  : 'regular'
              }
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
          <Panel style={{ maxHeight: '100%', ...spacings.ph3Xl }}>
            <AccountsOnPageList
              state={accountAdderState}
              privKeyOrSeed={privKeyOrSeed}
              setPage={setPage}
              keyType={keyType}
              lookingForLinkedAccounts={accountAdderState.linkedAccountsLoading}
              pageLoaded={accountAdderState.pageLoaded}
            />
          </Panel>
        </TabLayoutWrapperMainContent>
      </TabLayoutContainer>
    </AccountAdderIntroStepsProvider>
  )
}

export default React.memo(AccountAdderScreen)
