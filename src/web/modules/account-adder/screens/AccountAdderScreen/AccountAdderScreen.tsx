import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
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
  const { t } = useTranslation()
  const { theme } = useTheme()
  const mainControllerState = useMainControllerState()
  const accountAdderState = useAccountAdderControllerState()
  const { onImportReady, setPage, handleGoBack } = useAccountAdder({
    keySubType: accountAdderState.subType
  })

  // Since account adding a multi-step process where the Account Adder and the
  // Main controller interact, treat the SUCCESS state as a still loading one.
  // Otherwise, in the split second between when the Account Adder method succeeds
  // and the Main Controller one is still not triggered, the loading indicator blinks.
  const isLoading =
    ['LOADING', 'SUCCESS'].includes(accountAdderState.addAccountsStatus) ||
    ['LOADING', 'SUCCESS'].includes(mainControllerState.statuses.onAccountAdderSuccess)

  const isImportDisabled =
    isLoading || accountAdderState.accountsLoading || !accountAdderState.selectedAccounts.length

  return (
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
          <BackButton onPress={handleGoBack} />
          <Button
            testID="button-import-account"
            hasBottomSpacing={false}
            textStyle={{ fontSize: 14 }}
            onPress={onImportReady}
            size="large"
            disabled={isImportDisabled}
            text={
              isLoading
                ? t('Importing...')
                : !accountAdderState.selectedAccounts.length
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
            setPage={setPage}
            keyType={accountAdderState.type}
            subType={accountAdderState.subType}
            lookingForLinkedAccounts={accountAdderState.linkedAccountsLoading}
          />
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AccountAdderScreen)
