import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

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
  const { associatedKeys = [] } = accounts.find(({ addr }) => addr === selectedAccount) || {}
  const importedAccountKeys = keys.filter(({ addr }) => associatedKeys.includes(addr))

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
        sheetRef={sheetRef}
        associatedKeys={associatedKeys}
        keyPreferences={keyPreferences}
        keys={keys}
        importedAccountKeys={importedAccountKeys}
        closeBottomSheet={closeBottomSheet}
      />
    </>
  )
}

export default NoKeysToSignAlert
