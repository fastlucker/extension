import React from 'react'
import { View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import AccountKeyIcon from '../AccountKeyIcon/AccountKeyIcon'

const AccountKeyIcons = ({ account }: { account: AccountInterface }) => {
  const { keys } = useKeystoreControllerState()
  const associatedKeys = account?.associatedKeys || []
  const importedKeyTypes = [
    ...new Set(keys.filter(({ addr }) => associatedKeys.includes(addr)).map((key) => key.type))
  ]
  const { theme } = useTheme()

  return (
    <View style={[flexbox.directionRow]}>
      {importedKeyTypes.length === 0 && <NoKeysIcon color={theme.secondaryText} />}
      {importedKeyTypes.map((type, index) => {
        return (
          // @ts-ignore
          <View key={type || 'internal'} style={index !== 0 ? { 'margin-left': '-12px' } : {}}>
            <AccountKeyIcon type={type || 'internal'} />
          </View>
        )
      })}
    </View>
  )
}

export default React.memo(AccountKeyIcons)
