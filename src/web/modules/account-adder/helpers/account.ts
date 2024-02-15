// import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import { Account } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'

// TODO: Move this logic in the Account Adder
// Preselected accounts are the one for which we have a key (with the same type) stored.
export const getPreselectedAccounts = (
  accounts: Account[],
  // accountsOnPage: AccountAdderController['accountsOnPage'],
  keys: Key[],
  keyType: 'internal' | 'ledger' | 'trezor' | 'lattice'
) => {
  return accounts.filter((acc) => {
    const keysForThisAccount = keys.filter((key) => acc.associatedKeys.includes(key.addr))

    // TODO: Check not only if the type is the same, but also if there are keys
    // for this account with the same type but different address
    const keysForThisAccountWithTheSameType = keysForThisAccount.some((key) => key.type === keyType)

    return keysForThisAccountWithTheSameType
  })
}
