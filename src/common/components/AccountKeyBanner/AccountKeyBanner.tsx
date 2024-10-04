import React from 'react'

import { InternalKeyType, Key } from '@ambire-common/interfaces/keystore'
import LatticeIcon from '@common/assets/svg/LatticeIcon'
import LedgerLetterIcon from '@common/assets/svg/LedgerLetterIcon'
import NoKeysIcon from '@common/assets/svg/NoKeysIcon'
import SingleKeyIcon from '@common/assets/svg/SingleKeyIcon'
import TrezorLockIcon from '@common/assets/svg/TrezorLockIcon'
import useTheme from '@common/hooks/useTheme'
import { iconColors } from '@common/styles/themeConfig'

import Wrapper from './Wrapper'

const AccountKeyBanner = ({ type, subType }: { type: Key['type']; subType?: InternalKeyType }) => {
  const { theme } = useTheme()

  if (type === 'lattice')
    return (
      <Wrapper text="Lattice">
        <LatticeIcon color={theme.secondaryText} width={32} height={32} />
      </Wrapper>
    )
  if (type === 'trezor')
    return (
      <Wrapper text="Trezor">
        <TrezorLockIcon width={14} height={14} />
      </Wrapper>
    )
  if (type === 'ledger')
    return (
      <Wrapper text="Ledger">
        <LedgerLetterIcon width={14} height={14} />
      </Wrapper>
    )
  if (type === 'none')
    return (
      <Wrapper text="No keys">
        <NoKeysIcon width={14} height={14} color={theme.secondaryText} />
      </Wrapper>
    )

  const internalKeyType = !subType
    ? 'unknown'
    : subType === 'savedSeed'
    ? 'from saved seed'
    : 'external'
  return (
    <Wrapper text={internalKeyType}>
      <SingleKeyIcon color={iconColors.primary} width={16} height={16} />
    </Wrapper>
  )
}

export default React.memo(AccountKeyBanner)
