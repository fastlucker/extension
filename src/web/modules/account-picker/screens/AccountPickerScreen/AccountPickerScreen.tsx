import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import AccountPickerController from '@ambire-common/controllers/accountPicker/accountPicker'
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
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

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

  const setTitle = useCallback(
    (keyType: AccountPickerController['type'], subType: AccountPickerController['subType']) => {
      if (keyType && keyType !== 'internal') {
        return t('Import accounts from {{ hwDeviceName }}', {
          hwDeviceName: HARDWARE_WALLET_DEVICE_NAMES[keyType]
        })
      }

      if (subType === 'seed') {
        return accountPickerState.isInitializedWithSavedSeed
          ? t('Import accounts from saved seed phrase')
          : t('Import accounts from seed phrase')
      }

      if (subType === 'private-key') {
        return t('Select account(s) to import')
      }

      return t('Select accounts to import')
    },
    [accountPickerState.isInitializedWithSavedSeed, t]
  )

  const showBackButton = useMemo(() => {
    return !params || !params.hideBack
  }, [params])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="lg"
      header={<Header mode="custom-inner-content" withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent contentContainerStyle={[spacings.pt0]}>
        <Panel
          type="onboarding"
          title={setTitle(accountPickerState.type, accountPickerState.subType)}
          panelWidth={900}
          withBackButton={showBackButton}
          onBackButtonPress={() => goToPrevRoute()}
        >
          <AccountsOnPageList
            withTitle={false}
            state={accountPickerState}
            setPage={setPage}
            keyType={accountPickerState.type}
            subType={accountPickerState.subType}
            lookingForLinkedAccounts={accountPickerState.linkedAccountsLoading}
          >
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
          </AccountsOnPageList>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AccountPickerScreen)
