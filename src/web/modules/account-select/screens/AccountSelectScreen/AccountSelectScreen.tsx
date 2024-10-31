import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { Account as AccountType } from '@ambire-common/interfaces/account'
import AddIcon from '@common/assets/svg/AddIcon'
import BackButton from '@common/components/BackButton'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import ScrollableWrapper, { WRAPPER_TYPES } from '@common/components/ScrollableWrapper'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useAccountsList from '@common/hooks/useAccountsList'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import DashboardSkeleton from '@common/modules/dashboard/screens/Skeleton'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutContainer } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import Account from '@web/modules/account-select/components/Account'
import AddAccount from '@web/modules/account-select/components/AddAccount'

import getStyles from './styles'

const AccountSelectScreen = () => {
  const { styles, theme } = useTheme(getStyles)
  const flatlistRef = useRef(null)
  const {
    accounts,
    control,
    onContentSizeChange,
    keyExtractor,
    getItemLayout,
    isReadyToScrollToSelectedAccount
  } = useAccountsList({ flatlistRef })
  const { navigate } = useNavigation()
  const { selectedAccount } = useAccountsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { t } = useTranslation()
  const accountsContainerRef = useRef(null)
  const [pendingToBeSetSelectedAccount, setPendingToBeSetSelectedAccount] = useState('')

  const onAccountSelect = useCallback(
    (addr: AccountType['addr']) => setPendingToBeSetSelectedAccount(addr),
    []
  )

  const renderItem = ({ item: account }: { item: AccountType }) => {
    return (
      <Account
        onSelect={onAccountSelect}
        key={account.addr}
        account={account}
        withSettings={false}
      />
    )
  }

  useEffect(() => {
    // Navigate to the dashboard after the account is selected to avoid showing the dashboard
    // of the previously selected account.
    if (!selectedAccount || !pendingToBeSetSelectedAccount) return

    if (selectedAccount === pendingToBeSetSelectedAccount) {
      navigate(ROUTES.dashboard)
    }
  }, [selectedAccount, navigate, pendingToBeSetSelectedAccount])

  return !pendingToBeSetSelectedAccount ? (
    <TabLayoutContainer
      header={<Header withPopupBackButton withAmbireLogo />}
      footer={<BackButton />}
      width="lg"
      hideFooterInPopup
    >
      <View style={[flexbox.flex1, spacings.pv]} ref={accountsContainerRef}>
        <Search control={control} placeholder="Search for account" style={styles.searchBar} />
        <ScrollableWrapper
          type={WRAPPER_TYPES.FLAT_LIST}
          style={[
            styles.container,
            {
              opacity: isReadyToScrollToSelectedAccount ? 1 : 0
            }
          ]}
          wrapperRef={flatlistRef}
          data={accounts}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          onContentSizeChange={onContentSizeChange}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<Text>{t('No accounts found')}</Text>}
        />
        <View style={[spacings.ptSm, { width: '100%' }]}>
          <Button
            testID="button-add-account"
            text={t('Add Account')}
            type="secondary"
            hasBottomSpacing={false}
            onPress={openBottomSheet as any}
            childrenPosition="left"
            style={{ ...flexbox.alignSelfCenter, width: '100%' }}
          >
            <AddIcon color={theme.primary} style={spacings.mrTy} />
          </Button>
        </View>
      </View>
      <BottomSheet
        id="account-select-add-account"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
      >
        <AddAccount />
      </BottomSheet>
    </TabLayoutContainer>
  ) : (
    <DashboardSkeleton />
  )
}

export default React.memo(AccountSelectScreen)
