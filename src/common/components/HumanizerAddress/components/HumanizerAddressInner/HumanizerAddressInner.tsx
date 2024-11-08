import { getAddress, ZeroAddress } from 'ethers'
import React, { FC, useMemo } from 'react'

import { HumanizerMetaAddress } from '@ambire-common/libs/humanizer/interfaces'
import { Props as TextProps } from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import { isExtension } from '@web/constants/browserapi'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import BaseAddress from '../BaseAddress'
import { BenzinDomainsAddress, DomainsAddress } from '../DomainsAddress'

interface Props extends TextProps {
  address: string
  // example of highestPriorityAlias: a name coming from the humanizer's metadata
  highestPriorityAlias?: string
  explorerNetworkId?: string
  humanizerInfo?: HumanizerMetaAddress
}

const HumanizerAddressInner: FC<Props> = ({
  humanizerInfo,
  address,
  highestPriorityAlias,
  ...rest
}) => {
  const { accountPortfolio } = usePortfolioControllerState()
  const accountsState = useAccountsControllerState()
  const { t } = useTranslation()
  const { contacts = [] } = useAddressBookControllerState()
  const checksummedAddress = useMemo(() => getAddress(address), [address])

  const account = accountsState.accounts.find((a) => a.addr === checksummedAddress)
  const tokenInPortfolio = accountPortfolio.tokens.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
  const hardcodedTokenSymbol = humanizerInfo?.token?.symbol
  const hardcodedName = humanizerInfo?.name
  let tokenLabel = ''

  if (tokenInPortfolio) {
    tokenLabel = `Token ${tokenInPortfolio?.symbol} Contract`
  } else if (hardcodedTokenSymbol) {
    tokenLabel = t(`Token ${hardcodedTokenSymbol} Contract`)
  }

  const contact = contacts.find((c) => c.address.toLowerCase() === address.toLowerCase())
  const zeroAddressLabel = address === ZeroAddress && 'Zero Address'
  // highestPriorityAlias and account labels are of higher priority than domains
  if (
    highestPriorityAlias ||
    zeroAddressLabel ||
    contact?.name ||
    account?.preferences?.label ||
    hardcodedName ||
    tokenLabel
  )
    return (
      <BaseAddress address={checksummedAddress} {...rest}>
        {highestPriorityAlias ||
          zeroAddressLabel ||
          contact?.name ||
          account?.preferences?.label ||
          hardcodedName ||
          tokenLabel}
      </BaseAddress>
    )

  if (!isExtension) return <BenzinDomainsAddress address={checksummedAddress} {...rest} />

  return <DomainsAddress address={checksummedAddress} {...rest} />
}

export default React.memo(HumanizerAddressInner)
