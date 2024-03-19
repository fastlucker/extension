import { getAddress, ZeroAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { isValidAddress } from '@ambire-common/services/address'
import Alert from '@common/components/Alert/Alert'
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
import { storage } from '@web/extension-services/background/webapi/storage'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

type NetworkOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

const polygonMaticTokenAddress = '0x0000000000000000000000000000000000001010' // Polygon MATIC token address

const AddToken = () => {
  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()
  const { addToast } = useToast()
  const portfolio = usePortfolioControllerState()
  const mainCtrl = useMainControllerState()

  const selectedAccount = mainCtrl.selectedAccount || ''
  const [network, setNetwork] = useState<NetworkDescriptor>(
    networks.filter((n) => n.id === 'ethereum')[0]
  )
  // const [address, setAddress] = useState('')
  const [showAlreadyInPortfolioMessage, setShowAlreadyInPortfolioMessage] = useState<boolean>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdditionalHintRequested, setAdditionalHintRequested] = useState(false)

  const isControllerLoading =
    network?.id && portfolio.state.latest[selectedAccount][network?.id]?.isLoading

  const {
    control,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      address: ''
    }
  })
  const address = watch('address', '')

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

  const tokenTypeEligibility = useMemo(
    () => null || (address && portfolio.state.validTokens.erc20[`${address}-${network?.id}`]),
    [portfolio, address, network]
  )

  const tokenInPreferences = useMemo(
    () =>
      isValidAddress(address) &&
      portfolio.state.tokenPreferences?.find(
        (token: CustomToken) =>
          token.address === getAddress(address) && token.networkId === network?.id
      ),
    [portfolio.state.tokenPreferences, address, network]
  )

  const portfolioFoundToken = useMemo(
    () =>
      (isValidAddress(address) &&
        portfolio.accountPortfolio?.tokens?.find(
          (token) => token.address === getAddress(address) && token.networkId === network?.id
        )) ||
      tokenInPreferences,
    [portfolio, tokenInPreferences, address, network]
  )

  const handleTokenIsInPortfolio = async () => {
    const previousHints = await storage.get('previousHints', {})
    const isTokenInHints =
      previousHints?.[`${network?.id}:${address}`]?.erc20s.find(
        (addrs: any) => addrs === address
      ) || false
    const isNative =
      address === ZeroAddress || (network?.id === 'polygon' && address === polygonMaticTokenAddress)

    return isTokenInHints || tokenInPreferences || isNative
  }

  const handleAddToken = useCallback(async () => {
    if (!isValidAddress(address) || !network) return
    await portfolio.updateTokenPreferences({ ...portfolioFoundToken, networkId: network.id })
    reset({ address: '' })
    addToast(`Added token ${address} on ${network.name} to your portfolio`)
  }, [address, network, portfolio, addToast, portfolioFoundToken, reset])

  const handleTokenType = async () => {
    await portfolio.checkToken({ address, networkId: network.id })
  }

  useEffect(() => {
    const handleEffect = async () => {
      if (address && !isValidAddress(address))
        setError('address', { message: t('Invalid address') })

      if (address && network && !tokenTypeEligibility && isValidAddress(address)) {
        await handleTokenType()
      }

      if (tokenTypeEligibility) {
        // Check if token is already in portfolio
        const isTokenInHints = await handleTokenIsInPortfolio()
        if (isTokenInHints) {
          setIsLoading(false)
          setShowAlreadyInPortfolioMessage(true)
        } else if (!portfolioFoundToken && !isAdditionalHintRequested) {
          setAdditionalHintRequested(true)
          portfolio.updateAdditionalHints([getAddress(address)])
        }
      }
    }

    handleEffect()
  }, [address, network, tokenTypeEligibility, isAdditionalHintRequested])

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
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            label={t('Token Address')}
            placeholder={t('0x...')}
            value={value}
            containerStyle={spacings.mbSm}
            error={errors.address && errors.address.message}
          />
        )}
      />
      {(portfolioFoundToken && (
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
      )) ||
        null}
      {(address &&
        !portfolioFoundToken &&
        !showAlreadyInPortfolioMessage &&
        isAdditionalHintRequested &&
        !isControllerLoading && (
          <Alert
            type="error"
            isTypeLabelHidden
            title={t('This address does not match any token')}
            style={spacings.mbXl}
          />
        )) ||
        null}
      {showAlreadyInPortfolioMessage && (
        <Alert
          type="warning"
          isTypeLabelHidden
          title={t('This token is already handled in your wallet')}
          style={spacings.mbXl}
        />
      )}
      <Button
        disabled={
          showAlreadyInPortfolioMessage ||
          !isValidAddress(address) ||
          (!network && portfolioFoundToken) ||
          isSubmitting
        }
        text={t('Add Token')}
        hasBottomSpacing={false}
        style={{ maxWidth: 196 }}
        onPress={() => {
          handleAddToken()
        }}
      />
    </View>
  )
}

export default React.memo(AddToken)
