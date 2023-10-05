import { Account } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'

export const getDefaultSelectedAccount = (accounts: Account[]) => {
  if (accounts.length === 0) return null

  const smartAccounts = accounts.filter((acc) => acc.creation)
  if (smartAccounts.length) return smartAccounts[0]

  return accounts[0]
}

// Preselected accounts are the one for which we have a key (with the same type) stored.
export const getPreselectedAccounts = (
  accounts: Account[],
  keys: Key[],
  keyType: 'internal' | 'ledger' | 'trezor' | 'lattice'
) => {
  return accounts.filter((acc) => {
    const keysForThisAccount = keys.filter((key) => acc.associatedKeys.includes(key.addr))

    const keysForThisAccountWithTheSameType = keysForThisAccount.some((key) => key.type === keyType)

    return keysForThisAccountWithTheSameType
  })
}
