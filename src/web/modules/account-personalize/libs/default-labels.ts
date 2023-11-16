import { Account } from '@ambire-common/interfaces/account'
import { Key } from '@ambire-common/interfaces/keystore'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import { HARDWARE_WALLET_DEVICE_NAMES } from '@web/modules/hardware-wallet/constants/names'

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
