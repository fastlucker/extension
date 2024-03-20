import { getAddress } from 'ethers'
import React, { FC } from 'react'

import { Props as TextProps } from '@common/components/Text'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import BaseAddress from './components/BaseAddress'
import DomainsAddress from './components/DomainsAddress'

interface Props extends TextProps {
  address: string
  highestPriorityAlias?: string
  explorerNetworkId?: string
}

const Address: FC<Props> = ({ address: _address, highestPriorityAlias, ...rest }) => {
  const { accountPreferences } = useSettingsControllerState()
  const checksummedAddress = getAddress(_address)
  const { label: accountInWalletLabel } = accountPreferences[checksummedAddress] || {}

  // For example, a name coming from the humanizer's metadata
  if (highestPriorityAlias)
    return (
      <BaseAddress rawAddress={checksummedAddress} {...rest}>
        {highestPriorityAlias}
      </BaseAddress>
    )

  if (accountInWalletLabel)
    return (
      <BaseAddress rawAddress={checksummedAddress} {...rest}>
        {accountInWalletLabel}
      </BaseAddress>
    )

  return <DomainsAddress address={_address} {...rest} />
}

export default Address
