import { getAddress, ZeroAddress } from 'ethers'
import React, { FC, useMemo } from 'react'
import { Image, View } from 'react-native'

import humanizerInfo from '@ambire-common/consts/humanizer/humanizerInfo.json'
import { HumanizerMeta } from '@ambire-common/libs/humanizer/interfaces'
import { Props as TextProps } from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'
import { isExtension } from '@web/constants/browserapi'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import BaseAddress from './components/BaseAddress'
import { BenzinDomainsAddress, DomainsAddress } from './components/DomainsAddress'
import getStyles from './styles'

interface Props extends TextProps {
  address: string
  // example of highestPriorityAlias: a name coming from the humanizer's metadata
  highestPriorityAlias?: string
  explorerNetworkId?: string
}
const HUMANIZER_META = humanizerInfo as HumanizerMeta

const Address: FC<Props> = ({ address, highestPriorityAlias, ...rest }) => {
  const { accountPortfolio } = usePortfolioControllerState()
  const accountsState = useAccountsControllerState()
  const { t } = useTranslation()
  const { contacts = [] } = useAddressBookControllerState()
  const checksummedAddress = useMemo(() => getAddress(address), [address])
  const { styles } = useTheme(getStyles)

  const contractLogoUrl = useMemo(
    () => (humanizerInfo.knownAddresses as { [key: string]: any })[address.toLowerCase()]?.logo,
    [address]
  )

  const addressComponentPart = useMemo(() => {
    const account = accountsState.accounts.find((a) => a.addr === checksummedAddress)
    const tokenInPortfolio = accountPortfolio.tokens.find(
      (token) => token.address.toLowerCase() === address.toLowerCase()
    )
    const hardcodedTokenSymbol = HUMANIZER_META.knownAddresses[address.toLowerCase()]?.token?.symbol
    const hardcodedName = HUMANIZER_META.knownAddresses[address.toLowerCase()]?.name
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
  }, [
    highestPriorityAlias,
    checksummedAddress,
    rest,
    accountPortfolio?.tokens,
    accountsState.accounts,
    address,
    contacts,
    t
  ])

  return (
    <View style={flexbox.directionRow}>
      {contractLogoUrl && <Image source={{ uri: contractLogoUrl }} style={styles.logo} />}
      {addressComponentPart}
    </View>
  )
}

export default React.memo(Address)
