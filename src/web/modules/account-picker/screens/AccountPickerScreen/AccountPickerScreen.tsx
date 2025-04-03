import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import Header from '@common/modules/header/components/Header'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountPickerControllerState from '@web/hooks/useAccountPickerControllerState'
import AccountsOnPageList from '@web/modules/account-picker/components/AccountsOnPageList'
import useAccountPicker from '@web/modules/account-picker/hooks/useAccountPicker/useAccountPicker'

export interface Account {
  type: string
  address: string
  brandName: string
  alianName?: string
  displayBrandName?: string
  index?: number
  balance?: number
}

const AccountPickerScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { params } = useRoute()
  const accountPickerState = useAccountPickerControllerState()
  const { onImportReady, setPage } = useAccountPicker()
  const { goToPrevRoute } = useOnboardingNavigation()

  const isLoading = useMemo(
    () => accountPickerState.addAccountsStatus !== 'INITIAL',
    [accountPickerState.addAccountsStatus]
  )

  const isImportDisabled = useMemo(
    () =>
      isLoading ||
      accountPickerState.accountsLoading ||
      !accountPickerState.selectedAccounts.length,
    [isLoading, accountPickerState.accountsLoading, accountPickerState.selectedAccounts.length]
  )

  const showBackButton = useMemo(() => {
    return !params || !params.hideBack
  }, [params])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="lg"
      header={<Header withAmbireLogo />}
      footer={
        <>
          {showBackButton && <BackButton onPress={() => goToPrevRoute()} />}
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
                : !accountPickerState.selectedAccounts.length
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
      footerStyle={showBackButton ? flexbox.justifySpaceBetween : flexbox.justifyEnd}
    >
      <TabLayoutWrapperMainContent>
        <Panel style={{ maxHeight: '100%', ...spacings.ph3Xl }}>
          <AccountsOnPageList
            state={accountPickerState}
            setPage={setPage}
            keyType={accountPickerState.type}
            subType={accountPickerState.subType}
            lookingForLinkedAccounts={accountPickerState.linkedAccountsLoading}
          />
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AccountPickerScreen)
