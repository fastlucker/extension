import React, { memo } from 'react'
import { useModalize } from 'react-native-modalize'

import { Account } from '@ambire-common/interfaces/account'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import MultiKeysIcon from '@common/assets/svg/MultiKeysIcon'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import SingleKeyIcon from '@common/assets/svg/SingleKeyIcon'
import AccountKeysBottomSheet from '@common/components/AccountKeysBottomSheet'
import useTheme from '@common/hooks/useTheme'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import getStyles from './styles'

const AccountKeysButton = () => {
  const { theme, styles } = useTheme(getStyles)
  const { accounts, selectedAccount } = useAccountsControllerState()
  const { keys } = useKeystoreControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'borderColor',
    values: {
      from: `${String(theme.secondaryBackground)}00`,
      to: `${String(theme.secondaryBackground)}50`
    }
  })
  const account = accounts.find(({ addr }) => addr === selectedAccount)
  const associatedKeys = account?.associatedKeys || []
  const importedAccountKeys = keys.filter(({ addr }) => associatedKeys.includes(addr))

  // should never happen (selected account details are always present)
  if (!account) null

  return (
    <>
      <AnimatedPressable
        style={[styles.container, animStyle]}
        onPress={() => openBottomSheet()}
        {...bindAnim}
      >
        {importedAccountKeys.length === 0 && <NoKeysIcon />}
        {importedAccountKeys.length === 1 && <SingleKeyIcon />}
        {importedAccountKeys.length > 1 && <MultiKeysIcon />}
      </AnimatedPressable>
      <AccountKeysBottomSheet
        sheetRef={sheetRef}
        // Cast to Account to resolve TS warn, the ref enhances Account, so it's safe
        isSmartAccount={isSmartAccount(account as Account)}
        associatedKeys={associatedKeys}
        importedAccountKeys={importedAccountKeys}
        closeBottomSheet={closeBottomSheet}
      />
    </>
  )
}

export default memo(AccountKeysButton)
