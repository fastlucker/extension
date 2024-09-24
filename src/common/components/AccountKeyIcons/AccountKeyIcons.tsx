import React from 'react'

import { Account as AccountInterface } from '@ambire-common/interfaces/account'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import AccountKeyIcon from '../AccountKeyIcon/AccountKeyIcon'

const AccountKeyIcons = ({ account }: { account: AccountInterface }) => {
  const { keys } = useKeystoreControllerState()
  const associatedKeys = account?.associatedKeys || []
  const importedKeyTypes = [
    ...new Set(keys.filter(({ addr }) => associatedKeys.includes(addr)).map((key) => key.type))
  ]

  return (
    <>
      {importedKeyTypes.length === 0 && <NoKeysIcon />}
      {importedKeyTypes.map((type) => {
        return <AccountKeyIcon key={type || 'internal'} type={type || 'internal'} />
      })}
    </>
  )
}

export default React.memo(AccountKeyIcons)
