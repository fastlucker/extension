import React from 'react'
import { View } from 'react-native'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import AccountKeyBanner from '../AccountKeyBanner'
import AccountKeyIcon from '../AccountKeyIcon/AccountKeyIcon'

const AccountKeyIconOrBanner = ({ type, isExtended }: { type: string; isExtended: boolean }) => {
  return isExtended ? <AccountKeyBanner type={type} /> : <AccountKeyIcon type={type} />
}

const AccountKeyIcons = ({
  account,
  isExtended
}: {
  account: AccountInterface
  isExtended: boolean
}) => {
  const { keys } = useKeystoreControllerState()
  const associatedKeys = account?.associatedKeys || []
  const importedKeyTypes = Array.from(
    new Set(keys.filter(({ addr }) => associatedKeys.includes(addr)).map((key) => key.type))
  )
  const hasKeys = React.useMemo(() => importedKeyTypes.length > 0, [importedKeyTypes])

  return (
    <View style={[flexbox.directionRow, hasKeys ? spacings.mlTy : spacings.ml0]}>
      {hasKeys ? (
        importedKeyTypes.map((type, index) => {
          return (
            <View
              key={type || 'internal'}
              style={[index !== importedKeyTypes.length - 1 ? spacings.mrTy : spacings.mr0]}
            >
              <AccountKeyIconOrBanner type={type || 'internal'} isExtended={isExtended} />
            </View>
          )
        })
      ) : (
        <AccountKeyIconOrBanner type="none" isExtended={isExtended} />
      )}
    </View>
  )
}

export default React.memo(AccountKeyIcons)
