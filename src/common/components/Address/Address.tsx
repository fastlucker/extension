import { getAddress } from 'ethers'
import React, { FC } from 'react'

import { Props as TextProps } from '@common/components/Text'
import { isExtension } from '@web/constants/browserapi'
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
  const { label: accountInWalletLabel } = accountPreferences?.[checksummedAddress] || {}

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

  // DomainsAddress depends on the domains controller, thus we can't
  // use it in benzin.ambire.com
  if (!isExtension)
    return (
      <BaseAddress rawAddress={checksummedAddress} {...rest}>
        {checksummedAddress}
      </BaseAddress>
    )

  return <DomainsAddress address={_address} {...rest} />
}

export default Address
