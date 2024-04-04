import { getAddress } from 'ethers'
import React, { FC } from 'react'

import { Props as TextProps } from '@common/components/Text'
import { isExtension } from '@web/constants/browserapi'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import BaseAddress from './components/BaseAddress'
import { BenzinDomainsAddress, DomainsAddress } from './components/DomainsAddress'

interface Props extends TextProps {
  address: string
  // example of highestPriorityAlias: a name coming from the humanizer's metadata
  highestPriorityAlias?: string
  explorerNetworkId?: string
}

const Address: FC<Props> = ({ address, highestPriorityAlias, ...rest }) => {
  const { accountPreferences } = useSettingsControllerState()
  const { contacts = [] } = useAddressBookControllerState()
  const checksummedAddress = getAddress(address)
  const { label: accountInWalletLabel } = accountPreferences?.[checksummedAddress] || {}
  const contact = contacts.find((c) => c.address.toLowerCase() === address.toLowerCase())

  // highestPriorityAlias and account labels are of higher priority than domains
  if (highestPriorityAlias || contact?.name || accountInWalletLabel)
    return (
      <BaseAddress address={checksummedAddress} {...rest}>
        {highestPriorityAlias || contact?.name || accountInWalletLabel}
      </BaseAddress>
    )

  if (!isExtension) return <BenzinDomainsAddress address={checksummedAddress} {...rest} />

  return <DomainsAddress address={checksummedAddress} {...rest} />
}

export default Address
