import { Account } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'

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
