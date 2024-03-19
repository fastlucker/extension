import React from 'react'
import { useModalize } from 'react-native-modalize'

import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import SingleKeyIcon from '@common/assets/svg/SingleKeyIcon'
import AccountKeysBottomSheet from '@common/components/AccountKeysBottomSheet'
import useTheme from '@common/hooks/useTheme'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import getStyles from './styles'

const AccountKeysButton = () => {
  const { theme, styles } = useTheme(getStyles)
  const { accounts, selectedAccount } = useMainControllerState()
  const { keys } = useKeystoreControllerState()
  const { keyPreferences } = useSettingsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'borderColor',
    values: {
      from: `${String(theme.secondaryBackground)}00`,
      to: `${String(theme.secondaryBackground)}50`
    }
  })
  const { associatedKeys = [] } = accounts.find(({ addr }) => addr === selectedAccount) || {}
  const importedAccountKeys = keys.filter(({ addr }) => associatedKeys.includes(addr))

  return (
    <>
      <AnimatedPressable
        style={[styles.container, animStyle]}
        onPress={() => openBottomSheet()}
        {...bindAnim}
      >
        {importedAccountKeys.length === 0 && <NoKeysIcon />}
        {importedAccountKeys.length === 1 && <SingleKeyIcon />}
        {importedAccountKeys.length > 1 && <NoKeysIcon />}
      </AnimatedPressable>
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

export default AccountKeysButton
