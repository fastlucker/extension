import React from 'react'
import { View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import flexbox from '@common/styles/utils/flexbox'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import AccountKeyBanner from '../AccountKeyBanner'
import AccountKeyIcon from '../AccountKeyIcon/AccountKeyIcon'

const AccountKeyIcons = ({
  account,
  isExtended
}: {
  account: AccountInterface
  isExtended: boolean
}) => {
  const { keys } = useKeystoreControllerState()
  const associatedKeys = account?.associatedKeys || []
  const importedKeyTypes = [
    ...new Set(keys.filter(({ addr }) => associatedKeys.includes(addr)).map((key) => key.type))
  ]
  if (!importedKeyTypes.length) importedKeyTypes.push('none')

  return (
    <View style={[flexbox.directionRow]}>
      {importedKeyTypes.map((type, index) => {
        return (
          // @ts-ignore
          <View key={type || 'internal'} style={index !== 0 ? { 'margin-left': '-12px' } : {}}>
            {isExtended ? (
              <AccountKeyBanner type={type || 'internal'} />
            ) : (
              <AccountKeyIcon type={type || 'internal'} />
            )}
          </View>
        )
      })}
    </View>
  )
}

export default React.memo(AccountKeyIcons)
