import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isSmartAccount } from '@ambire-common/libs/account/account'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import AccountKeysBottomSheet from '@common/components/AccountKeysBottomSheet'
import Alert from '@common/components/Alert'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const NoKeysToSignAlert = () => {
  const { accounts, selectedAccount } = useMainControllerState()
  const { keys } = useKeystoreControllerState()
  const { keyPreferences } = useSettingsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const account = accounts.find(({ addr }) => addr === selectedAccount)
  const associatedKeys = account?.associatedKeys || []
  const importedAccountKeys = keys.filter(({ addr }) => associatedKeys.includes(addr))

  // TODO: Error?
  if (!account) return null

  return (
    <>
      <View
        style={{
          ...spacings.ptSm,
          marginTop: 'auto'
        }}
      >
        <Alert
          type="error"
          title={t('No keys available to sign this transaction.')}
          customIcon={() => <NoKeysIcon color={theme.secondaryText} />}
          buttonProps={{
            onPress: () => openBottomSheet(),
            text: t('Import Key')
          }}
        />
      </View>
      <AccountKeysBottomSheet
        isSmartAccount={isSmartAccount(account)}
        sheetRef={sheetRef}
        associatedKeys={associatedKeys}
        keyPreferences={keyPreferences}
        importedAccountKeys={importedAccountKeys}
        closeBottomSheet={closeBottomSheet}
      />
    </>
  )
}

export default NoKeysToSignAlert
