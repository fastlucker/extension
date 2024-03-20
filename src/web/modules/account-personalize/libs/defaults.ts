import { Account } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'
import { AccountPreferences } from '@ambire-common/interfaces/settings'
import { isDerivedForSmartAccountKeyOnly } from '@ambire-common/libs/account/account'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

// TODO: temp disabled (will use only blockies with no option to customize the pfp)
// import {
//   BUILD_IN_AVATAR_ID_PREFIX,
//   buildInAvatars
// } from '../components/AccountPersonalizeCard/avatars'

export const getDefaultAccountLabel = (account: Account, prevAccounts: Account[], i: number) => {
  // If an account with the same address already exists, skip,
  // in order to persist the already stored account preferences.
  const existingAcc = prevAccounts.find(({ addr }) => addr === account.addr)
  if (existingAcc) return null

  const number = prevAccounts.length + (i + 1)
  return `Account ${number}`
}

// TODO: temp disabled (will use only blockies with no option to customize the pfp)
// export const getDefaultAccountPfp = (prevAccountsCount: number, i: number) => {
//   return (
//     BUILD_IN_AVATAR_ID_PREFIX +
//     // Iterate from 1 up to the `buildInAvatars.length` and then - start all
//     // over again from the beginning (from 1).
//     ((prevAccountsCount + i + 1) % buildInAvatars.length || buildInAvatars.length)
//   )
// }

export const getDefaultKeyLabel = (keyType: Key['type'], index: number, slot: number) => {
  const prefix = isDerivedForSmartAccountKeyOnly(index) ? 'Ambire Key' : 'Basic Key'
  const from = keyType === 'internal' ? 'Private Key' : HARDWARE_WALLET_DEVICE_NAMES[keyType]

  return `${prefix} (${from}) from slot ${slot}`
}

// TODO: Importing account as view only, but we have a key for this account,
// so technically... it's not a view only account anymore.
// TODO: Importing account, but is was previously imported as a view only one.
export const getDefaultAccountPreferences = (newAccounts: Account[], prevAccounts: Account[]) => {
  const defaultAccountPreferences: AccountPreferences = {}

  newAccounts.forEach((account, i) => {
    const label = getDefaultAccountLabel(account, prevAccounts, i)

    if (label) {
      defaultAccountPreferences[account.addr] = { label, pfp: account.addr }
    }
  })

  return defaultAccountPreferences
}
