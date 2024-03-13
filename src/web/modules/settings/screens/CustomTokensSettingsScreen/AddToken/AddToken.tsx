import { getAddress } from 'ethers'
import React, { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { isValidAddress } from '@ambire-common/services/address'
import Button from '@common/components/Button'
import CoingeckoConfirmedBadge from '@common/components/CoingeckoConfirmedBadge'
import Input from '@common/components/Input'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useToast from '@common/hooks/useToast'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

type NetworkOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

const AddToken = () => {
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()
  const { addToast } = useToast()

  const [network, setNetwork] = useState<NetworkDescriptor>(
    networks.filter((n) => n.id === 'ethereum')[0]
  )
  const portfolio = usePortfolioControllerState()

  const [address, setAddress] = useState('')

  const handleSetNetworkValue = useCallback(
    (networkOption: NetworkOption) => {
      setNetwork(networks.filter((net) => net.id === networkOption.value)[0])
    },
    [networks]
  )

  const networksOptions: NetworkOption[] = useMemo(
    () =>
      networks.map((n) => ({
        value: n.id,
        label: <Text weight="medium">{t(n.name)}</Text>,
        icon: <NetworkIcon name={n.id as NetworkIconNameType} />
      })),
    [t, networks]
  )

  const handleSetAddress = useCallback(
    (e: any) => {
      setAddress(e.target.value)
      if (!isValidAddress(e.target.value)) return

      const tokenAddr = getAddress(e.target.value)

      if (isValidAddress(getAddress(tokenAddr)) && network) {
        portfolio.updateAdditionalHints([tokenAddr])
      }
    },
    [network, portfolio]
  )
  const portfolioFoundToken = portfolio.accountPortfolio?.tokens?.find(
    (token) => token.address === address
  )

  const handleAddToken = useCallback(async () => {
    if (!isValidAddress(address) || !network) return

    await portfolio.updateTokenPreferences({
      address,
      networkId: network.id,
      standard: 'ERC20',
      decimals: portfolioFoundToken?.decimals,
      name: portfolioFoundToken?.name
    })

    addToast(`Added token ${address} on ${network.name} to your portfolio`)
  }, [
    address,
    network,
    portfolio,
    addToast,
    portfolioFoundToken?.decimals,
    portfolioFoundToken?.name
  ])

  return (
    <View style={flexbox.flex1}>
      <Text fontSize={20} style={[spacings.mtTy, spacings.mb2Xl]} weight="medium">
        {t('Add Token')}
      </Text>
      <Select
        setValue={handleSetNetworkValue}
        options={networksOptions}
        value={networksOptions.filter((opt) => opt.value === network.id)[0]}
        label={t('Choose Network')}
        style={spacings.mbMd}
      />
      <Input
        onChange={handleSetAddress}
        label={t('Token Address')}
        placeholder={t('0x...')}
        value={address}
        containerStyle={spacings.mbSm}
      />
      {portfolioFoundToken ? (
        <View
          style={[
            flexbox.directionRow,
            flexbox.justifySpaceBetween,
            flexbox.alignCenter,
            spacings.mbXl,
            spacings.phTy,
            spacings.pvTy
          ]}
        >
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <TokenIcon
              containerHeight={32}
              containerWidth={32}
              width={22}
              height={22}
              withContainer
              networkId={network.id}
              address={address}
            />
            <Text fontSize={16} style={spacings.mlTy} weight="semiBold">
              {portfolioFoundToken?.symbol}
            </Text>
          </View>
          <View style={flexbox.directionRow}>
            {portfolioFoundToken?.priceIn?.length ? (
              <CoingeckoConfirmedBadge text="Confirmed" />
            ) : null}
          </View>
        </View>
      ) : null}
      <Button
        disabled={!isValidAddress(address) || !network}
        text={t('Add Token')}
        hasBottomSpacing={false}
        style={{ maxWidth: 196 }}
        onPress={() => {
          handleAddToken()
          setAddress('')
        }}
      />
    </View>
  )
}

export default React.memo(AddToken)
