import React from 'react'
import { View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import spacings from '@common/styles/spacings'
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
  keys.push({
    addr: '0xBd84Cc40a5b5197B5B61919c22A55e1c46d2A3bb',
    dedicatedToOneSA: true,
    isExternallyStored: false,
    label: 'Key 1',
    meta: { createdAt: 1728022945526 },
    type: 'internal',
    subType: 'savedSeed'
  })
  const importedKeyTypes = [
    ...new Set(keys.filter(({ addr }) => associatedKeys.includes(addr)).map((key) => key.type))
  ]
  if (!importedKeyTypes.length) importedKeyTypes.push('none')

  return (
    <View style={[flexbox.directionRow]}>
      {importedKeyTypes.map((type, index) => {
        return (
          <View
            key={type || 'internal'}
            style={[index !== importedKeyTypes.length - 1 ? spacings.mrTy : spacings.mr0]}
          >
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
