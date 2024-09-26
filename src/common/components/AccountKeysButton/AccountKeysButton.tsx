import React, { memo } from 'react'
import { useModalize } from 'react-native-modalize'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import MultiKeysIcon from '@common/assets/svg/MultiKeysIcon'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import SingleKeyIcon from '@common/assets/svg/SingleKeyIcon'
import AccountKeysBottomSheet from '@common/components/AccountKeysBottomSheet'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import getStyles from './styles'

const AccountKeysButton = ({ account }: { account: AccountInterface }) => {
  const { theme, styles } = useTheme(getStyles)
  const { keys } = useKeystoreControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'borderColor',
    values: {
      from: `${String(theme.primaryBackground)}`,
      to: `${String(theme.primaryBackground)}`
    }
  })
  const associatedKeys = account?.associatedKeys || []
  const importedAccountKeys = keys.filter(({ addr }) => associatedKeys.includes(addr))

  // should never happen (selected account details are always present)
  if (!account) null

  return (
    <>
      <AnimatedPressable
        style={[styles.container, animStyle, spacings.mrMi]}
        onPress={() => openBottomSheet()}
        {...bindAnim}
      >
        {importedAccountKeys.length === 0 && <NoKeysIcon />}
        {importedAccountKeys.length === 1 && <SingleKeyIcon />}
        {importedAccountKeys.length > 1 && <MultiKeysIcon />}
      </AnimatedPressable>
      <AccountKeysBottomSheet
        sheetRef={sheetRef}
        account={account}
        closeBottomSheet={closeBottomSheet}
      />
    </>
  )
}

export default memo(AccountKeysButton)
