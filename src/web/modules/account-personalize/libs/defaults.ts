import { Account } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'
import {
  isDerivedForSmartAccountKeyOnly,
  isSmartAccount
} from '@ambire-common/libs/account/account'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

import {
  BUILD_IN_AVATAR_ID_PREFIX,
  buildInAvatars
} from '../components/AccountPersonalizeCard/avatars'

const KEY_SUBTYPE_TO_LABEL = {
  seed: 'Seed',
  'private-key': 'Private Key'
}

export const getDefaultAccountLabel = (
  account: Account,
  prevAccountsCount: number,
  i: number,
  keyType: Key['type'],
  keyTypeInternalSubtype: keyof typeof KEY_SUBTYPE_TO_LABEL
) => {
  const suffix =
    !keyType && !keyTypeInternalSubtype
      ? '(View Only)'
      : `(${isSmartAccount(account) ? 'Ambire via' : 'Legacy from'} ${
          HARDWARE_WALLET_DEVICE_NAMES[keyType] || KEY_SUBTYPE_TO_LABEL[keyTypeInternalSubtype]
        })`

  return `Account ${prevAccountsCount + (i + 1)} ${suffix}`
}

export const getDefaultAccountPfp = (prevAccountsCount: number, i: number) => {
  return (
    BUILD_IN_AVATAR_ID_PREFIX +
    // Iterate from 1 up to the `buildInAvatars.length` and then - start all
    // over again from the beginning (from 1).
    ((prevAccountsCount + i + 1) % buildInAvatars.length || buildInAvatars.length)
  )
}

export const getDefaultKeyLabel = (
  customLabel: string,
  keyType: Key['type'],
  index: number,
  slot: number
) => {
  const prefix = isDerivedForSmartAccountKeyOnly(index) ? 'Ambire Key' : 'Legacy Key'
  const from =
    customLabel || (keyType === 'internal' ? 'Private Key' : HARDWARE_WALLET_DEVICE_NAMES[keyType])

  return `${prefix} (${from}) from slot ${slot}`
}
