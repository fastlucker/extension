import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isSmartAccount } from '@ambire-common/libs/account/account'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import AccountKeysBottomSheet from '@common/components/AccountKeysBottomSheet'
import Alert from '@common/components/Alert'
import useTheme from '@common/hooks/useTheme'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

interface Props {
  style?: ViewStyle
}

const NoKeysToSignAlert: FC<Props> = ({ style }) => {
  const { accounts, selectedAccount } = useAccountsControllerState()
  const { keys } = useKeystoreControllerState()
  const { keyPreferences } = useSettingsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const account = accounts.find(({ addr }) => addr === selectedAccount)
  const associatedKeys = account?.associatedKeys || []
  const importedAccountKeys = keys.filter(({ addr }) => associatedKeys.includes(addr))

  // should never happen (selected account details are always present)
  if (!account) return null

  return (
    <View style={style}>
      <Alert
        type="error"
        title={t('No keys available to sign this transaction.')}
        customIcon={() => <NoKeysIcon color={theme.secondaryText} />}
        buttonProps={{
          onPress: () => openBottomSheet(),
          text: t('Import Key')
        }}
      />
      <AccountKeysBottomSheet
        isSmartAccount={isSmartAccount(account)}
        sheetRef={sheetRef}
        associatedKeys={associatedKeys}
        keyPreferences={keyPreferences}
        importedAccountKeys={importedAccountKeys}
        closeBottomSheet={closeBottomSheet}
      />
    </View>
  )
}

export default NoKeysToSignAlert
