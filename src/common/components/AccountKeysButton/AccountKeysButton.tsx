import React from 'react'
import { Pressable } from 'react-native'
import { useModalize } from 'react-native-modalize'

import MultiKeysIcon from '@common/assets/svg/MultiKeysIcon'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import SingleKeyIcon from '@common/assets/svg/SingleKeyIcon'
import AccountKeysBottomSheet from '@common/components/AccountKeysBottomSheet'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const AccountKeysButton = () => {
  const { accounts, selectedAccount } = useMainControllerState()
  const { keys } = useKeystoreControllerState()
  const { keyPreferences } = useSettingsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { associatedKeys = [] } = accounts.find(({ addr }) => addr === selectedAccount) || {}
  const importedAccountKeys = keys.filter(({ addr }) => associatedKeys.includes(addr))

  return (
    <>
      <Pressable
        style={{
          width: 32,
          height: 32,
          ...flexbox.center,
          backgroundColor: '#14183326',
          borderRadius: BORDER_RADIUS_PRIMARY
        }}
        onPress={() => openBottomSheet()}
      >
        {importedAccountKeys.length === 0 && <NoKeysIcon />}
        {importedAccountKeys.length === 1 && <SingleKeyIcon />}
        {importedAccountKeys.length > 1 && <MultiKeysIcon />}
      </Pressable>
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
