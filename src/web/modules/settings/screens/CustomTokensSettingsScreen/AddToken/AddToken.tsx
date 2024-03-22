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
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useToast from '@common/hooks/useToast'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import {
  getTokenEligibility,
  getTokenFromPortfolio,
  getTokenFromPreferences,
  handleTokenIsInPortfolio,
  selectNetwork
} from '@web/modules/notification-requests/screens/WatchTokenRequestScreen/utils'

type NetworkOption = {
  value: string
  label: JSX.Element
  icon: JSX.Element
}

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

  const [showAlreadyInPortfolioMessage, setShowAlreadyInPortfolioMessage] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdditionalHintRequested, setAdditionalHintRequested] = useState(false)

  const isControllerLoading =
    network?.id && portfolio.state.latest[selectedAccount][network?.id]?.isLoading

  const {
    control,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting }
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
    () => getTokenEligibility({ address }, portfolio, network),
    [portfolio, address, network]
  )

  const tokenInPreferences = useMemo(
    () => getTokenFromPreferences({ address }, network, portfolio.state.tokenPreferences),
    [portfolio.state.tokenPreferences, address, network]
  )

  const portfolioFoundToken = useMemo(
    () =>
      getTokenFromPortfolio({ address }, network, portfolio?.accountPortfolio, tokenInPreferences),
    [portfolio, tokenInPreferences, address, network]
  )

  const handleAddToken = useCallback(async () => {
    if (!isValidAddress(address) || !network) return
    await portfolio.updateTokenPreferences({
      address: portfolioFoundToken?.address || address,
      name: portfolioFoundToken?.name || '',
      symbol: portfolioFoundToken?.symbol || '',
      decimals: portfolioFoundToken?.decimals || 18,
      networkId: network.id,
      standard: 'ERC20'
    })
    reset({ address: '' })
    setAdditionalHintRequested(false)
    addToast(t(`Added token ${address} on ${network.name} to your portfolio`))
  }, [address, network, portfolio, addToast, portfolioFoundToken, reset, t])

  const handleTokenType = async () => {
    await portfolio.checkToken({ address, networkId: network.id })
  }

  useEffect(() => {
    const handleEffect = async () => {
      if (address && !isValidAddress(address)) {
        setError('address', { message: t('Invalid address') })
      }

      if (address && network && !tokenTypeEligibility && isValidAddress(address)) {
        setIsLoading(true)
        await handleTokenType()
      }

      if (tokenTypeEligibility) {
        setIsLoading(true)

        // Check if token is already in portfolio
        const isTokenInHints = await handleTokenIsInPortfolio(
          tokenInPreferences,
          portfolio.accountPortfolio,
          network,
          { address }
        )
        if (isTokenInHints) {
          setIsLoading(false)
          setShowAlreadyInPortfolioMessage(true)
        } else if (!portfolioFoundToken && !isAdditionalHintRequested) {
          portfolio.updateAdditionalHints([getAddress(address)])
          setAdditionalHintRequested(true)
        }
      }
    }

    handleEffect().catch(() => setIsLoading(false))

    if (tokenTypeEligibility === false || !!portfolioFoundToken) {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, address, network, tokenTypeEligibility, portfolioFoundToken, isAdditionalHintRequested])

  useEffect(() => {
    setShowAlreadyInPortfolioMessage(false) // Reset the state when address changes
    setAdditionalHintRequested(false)
  }, [address])

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
              <CoingeckoConfirmedBadge text="Confirmed" address={address} networkId={network?.id} />
            ) : null}
          </View>
        </View>
      ) : null}
      {address && tokenTypeEligibility === false ? (
        <Alert
          type="error"
          isTypeLabelHidden
          title={t('This token type is not supported.')}
          style={spacings.mbXl}
        />
      ) : null}

      {/* TODO: This shows up whem isControllerLoading= false but portfolioFoundToken is not returned */}
      {/* {!portfolioFoundToken &&
        !showAlreadyInPortfolioMessage &&
        isAdditionalHintRequested &&
        !isControllerLoading && (
          <Alert type="warning" isTypeLabelHidden title={t('Token not found in portfolio.')} />
        )} */}
      {address && showAlreadyInPortfolioMessage ? (
        <Alert
          type="warning"
          isTypeLabelHidden
          title={t('This token is already handled in your wallet')}
          style={spacings.mbXl}
        />
      ) : null}

      {isLoading && isControllerLoading ? (
        <View style={[flexbox.alignCenter, flexbox.justifyCenter, spacings.mbTy]}>
          <Spinner style={{ width: 18, height: 18 }} />
        </View>
      ) : null}

      <Button
        disabled={
          showAlreadyInPortfolioMessage ||
          !tokenTypeEligibility ||
          !isValidAddress(address) ||
          (!network && portfolioFoundToken) ||
          isSubmitting
        }
        text={t('Add Token')}
        hasBottomSpacing={false}
        style={{ maxWidth: 196 }}
        onPress={() => handleAddToken()}
      />
    </View>
  )
}

export default React.memo(AddToken)
