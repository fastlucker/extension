import React from 'react'

import { Key } from '@ambire-common/interfaces/keystore'
import LatticeMiniIcon from '@common/assets/svg/LatticeMiniIcon'
import LedgerMiniIcon from '@common/assets/svg/LedgerMiniIcon'
import PrivateKeyMiniIcon from '@common/assets/svg/PrivateKeyMiniIcon'
import TrezorMiniIcon from '@common/assets/svg/TrezorMiniIcon'

const AccountKeyIcon = ({ type }: { type: Key['type'] }) => {
  if (type === 'lattice') return <LatticeMiniIcon width={24} height={24} />
  if (type === 'trezor') return <TrezorMiniIcon width={24} height={24} />
  if (type === 'ledger') return <LedgerMiniIcon width={24} height={24} />

  return <PrivateKeyMiniIcon width={24} height={24} />
}

export default React.memo(AccountKeyIcon)
