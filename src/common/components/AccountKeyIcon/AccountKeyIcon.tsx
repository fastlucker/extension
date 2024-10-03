import React from 'react'

import { Key } from '@ambire-common/interfaces/keystore'
import LatticeIcon from '@common/assets/svg/LatticeIcon'
import LedgerLetterIcon from '@common/assets/svg/LedgerLetterIcon'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import SingleKeyIcon from '@common/assets/svg/SingleKeyIcon'
import TrezorLockIcon from '@common/assets/svg/TrezorLockIcon'
import useTheme from '@common/hooks/useTheme'

const AccountKeyIcon = ({ type }: { type: Key['type'] }) => {
  const { theme } = useTheme()

  if (type === 'lattice') return <LatticeIcon width={32} height={32} color="#fff" />
  if (type === 'trezor') return <TrezorLockIcon color="#fff" width={20} height={20} />
  if (type === 'ledger') return <LedgerLetterIcon color="#fff" width={20} height={20} />
  if (type === 'none') return <NoKeysIcon color={theme.secondaryText} width={20} height={20} />

  return <SingleKeyIcon color="none" width={20} height={20} />
}

export default React.memo(AccountKeyIcon)
