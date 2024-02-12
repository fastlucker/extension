import { Account } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'
import { AccountPreferences } from '@ambire-common/interfaces/settings'
import {
  isDerivedForSmartAccountKeyOnly,
  isSmartAccount
} from '@ambire-common/libs/account/account'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

// TODO: temp disabled (will use only blockies with no option to customize the pfp)
// import {
//   BUILD_IN_AVATAR_ID_PREFIX,
//   buildInAvatars
// } from '../components/AccountPersonalizeCard/avatars'

const KEY_SUBTYPE_TO_LABEL = {
  seed: 'Seed',
  'private-key': 'Private Key'
}

export const getDefaultAccountLabel = (
  account: Account,
  prevAccountsCount: number,
  i: number,
  keyType?: Key['type'],
  keyTypeInternalSubtype?: keyof typeof KEY_SUBTYPE_TO_LABEL
) => {
  const suffix =
    !keyType && !keyTypeInternalSubtype
      ? '(View Only)'
      : `(${isSmartAccount(account) ? 'Ambire via' : 'Basic from'} ${
          (keyType && HARDWARE_WALLET_DEVICE_NAMES[keyType]) ||
          KEY_SUBTYPE_TO_LABEL[keyTypeInternalSubtype as keyof typeof KEY_SUBTYPE_TO_LABEL] ||
          keyTypeInternalSubtype
        })`

  return `Account ${prevAccountsCount + (i + 1)} ${suffix}`
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

export const getDefaultKeyLabel = (
  keyType: Key['type'],
  index: number,
  slot: number,
  customLabel?: string
) => {
  const prefix = isDerivedForSmartAccountKeyOnly(index) ? 'Ambire Key' : 'Basic Key'
  const from =
    customLabel || (keyType === 'internal' ? 'Private Key' : HARDWARE_WALLET_DEVICE_NAMES[keyType])

  return `${prefix} (${from}) from slot ${slot}`
}

export const getDefaultAccountPreferences = (
  accounts: Account[],
  prevAccountsCount: number,
  keyType?: Key['type'],
  keyTypeInternalSubtype?: 'seed' | 'private-key'
) => {
  const defaultAccountPreferences: AccountPreferences = {}

  accounts.forEach((account, i) => {
    const label = getDefaultAccountLabel(
      account,
      prevAccountsCount,
      i,
      keyType,
      keyTypeInternalSubtype
    )

    defaultAccountPreferences[account.addr] = { label, pfp: account.addr }
  })

  return defaultAccountPreferences
}
