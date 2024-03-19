import { getAddress, ZeroAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/networkDescriptor'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Alert from '@common/components/Alert/Alert'
import Button from '@common/components/Button'
import CoingeckoConfirmedBadge from '@common/components/CoingeckoConfirmedBadge'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const polygonMaticTokenAddress = '0x0000000000000000000000000000000000001010' // Polygon MATIC token address

const WatchTokenRequestScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const state = useNotificationControllerState()
  const portfolio = usePortfolioControllerState()
  const mainCtrl = useMainControllerState()
  const { networks } = useSettingsControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''

  const tokenData = state?.currentNotificationRequest?.params?.data?.options
  const origin = state?.currentNotificationRequest?.params?.session?.origin
  const network =
    networks.find((n) => n.explorerUrl === origin) ||
    networks.find((n) => n.id === tokenData?.networkId)
  const [showAlreadyInPortfolioMessage, setShowAlreadyInPortfolioMessage] = useState<boolean>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tokenNetwork, setTokenNetwork] = useState(network)
  const [isAdditionalHintRequested, setAdditionalHintRequested] = useState(false)

  const isControllerLoading = portfolio.state.latest[selectedAccount][tokenNetwork?.id]?.isLoading

  const tokenTypeEligibility = useMemo(
    () =>
      null ||
      (tokenData && portfolio.state.validTokens.erc20[`${tokenData?.address}-${tokenNetwork?.id}`]),
    [portfolio, tokenData, tokenNetwork]
  )

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  // Handle the case its already in token preferences
  const tokenInPreferences = useMemo(
    () =>
      tokenData &&
      portfolio.state.tokenPreferences?.find(
        (t) => t.address === getAddress(tokenData?.address && t.networkId === tokenNetwork?.id)
      ),
    [portfolio.state.tokenPreferences, tokenData, tokenNetwork]
  )

  const portfolioFoundToken = useMemo(
    () =>
      (tokenData &&
        portfolio.accountPortfolio?.tokens?.find(
          (t) => t.address === getAddress(tokenData?.address && t.networkId === tokenNetwork?.id)
        )) ||
      tokenInPreferences,
    [portfolio, tokenInPreferences, tokenData, tokenNetwork]
  )

  const handleTokenType = async (networkId: NetworkId) => {
    await portfolio.checkToken({ address: tokenData?.address, networkId })
  }

  const handleTokenIsInPortfolio = async () => {
    const previousHints = await storage.get('previousHints', {})
    const isTokenInHints =
      previousHints?.[`${tokenNetwork?.id}:${tokenData?.address}`]?.erc20s.find(
        (addrs: any) => addrs === tokenData?.address
      ) || false
    const isNative =
      tokenData?.address === ZeroAddress ||
      (tokenNetwork?.id === 'polygon' && tokenData?.address === polygonMaticTokenAddress)

    return isTokenInHints || tokenInPreferences || isNative
  }

  const selectNetwork = async () => {
    if (!network && !tokenNetwork?.id) {
      const validTokenNetworks = networks.filter(
        (_network) => portfolio.state.validTokens.erc20[`${tokenData?.address}-${_network.id}`]
      )

      if (validTokenNetworks.length > 0) {
        const newTokenNetwork = validTokenNetworks.find(
          (_network) => _network.id !== tokenNetwork?.id
        )
        if (newTokenNetwork) {
          setTokenNetwork(newTokenNetwork)
        }
      } else {
        await Promise.all(networks.map((_network) => handleTokenType(_network.id)))
      }
    }
  }

  useEffect(() => {
    const handleEffect = async () => {
      await selectNetwork()

      if (tokenNetwork) {
        // Check if token is eligible to add in portfolio
        if (tokenData && !tokenTypeEligibility) {
          await handleTokenType(tokenNetwork?.id)
        }

        if (tokenTypeEligibility) {
          // Check if token is already in portfolio
          const isTokenInHints = await handleTokenIsInPortfolio()
          if (isTokenInHints) {
            setIsLoading(false)
            setShowAlreadyInPortfolioMessage(true)
          } else if (!portfolioFoundToken && !isAdditionalHintRequested) {
            setAdditionalHintRequested(true)
            portfolio.updateAdditionalHints([getAddress(tokenData?.address)])
          }
        }
      }
    }

    handleEffect().catch((e) => setIsLoading(false))

    if (tokenTypeEligibility === false || !!portfolioFoundToken) {
      setIsLoading(false)
    }
  }, [
    network,
    tokenData,
    tokenNetwork,
    networks,
    selectedAccount,
    tokenTypeEligibility,
    portfolioFoundToken,
    setIsLoading,
    tokenInPreferences,
    portfolio.state.validTokens
  ])

  const handleAddToken = useCallback(async () => {
    const token = {
      address: getAddress(tokenData.address),
      name: tokenData?.name,
      symbol: tokenData?.symbol,
      decimals: tokenData?.decimals,
      standard: state?.currentNotificationRequest?.params?.data?.type,
      networkId: tokenNetwork?.id
    }

    await portfolio.updateTokenPreferences(token)
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST',
      params: { data: null }
    })
  }, [dispatch, state, tokenData, tokenNetwork, portfolio])

  const tokenDetails = useMemo(
    () => portfolioFoundToken && portfolioFoundToken?.flags && getTokenDetails(portfolioFoundToken),
    [portfolioFoundToken]
  )

  if (
    !portfolioFoundToken &&
    !showAlreadyInPortfolioMessage &&
    isAdditionalHintRequested &&
    !isControllerLoading
  ) {
    return <Alert type="warning" title={t('Token not found in portfolio.')} />
  }

  if (isLoading || tokenTypeEligibility === undefined) {
    return (
      <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
        <Spinner />
      </View>
    )
  }

  return (
    <TabLayoutContainer
      width="full"
      header={
        <HeaderAccountAndNetworkInfo
          networkName={tokenNetwork?.name}
          networkId={tokenNetwork?.id}
        />
      }
      footer={
        <>
          <Button
            text={t('Cancel')}
            type="danger"
            hasBottomSpacing={false}
            style={spacings.phLg}
            onPress={handleCancel}
          >
            <View style={spacings.pl}>
              <CloseIcon color={theme.errorDecorative} />
            </View>
          </Button>

          <Button
            style={spacings.phLg}
            hasBottomSpacing={false}
            onPress={handleAddToken}
            disabled={isLoading || showAlreadyInPortfolioMessage || !tokenTypeEligibility}
            text={t('Add token')}
          />
        </>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg}>
        {!tokenTypeEligibility ? (
          <Alert type="error" title={t('This token type is not supported.')} />
        ) : (
          <>
            {showAlreadyInPortfolioMessage ? (
              <Text weight="medium" fontSize={20} style={spacings.mbLg}>
                {tokenInPreferences
                  ? t('This token is already in your preferences.')
                  : t('This token is already in your portfolio.')}
              </Text>
            ) : (
              <>
                <Text weight="medium" fontSize={20} style={spacings.mbLg}>
                  {t('Add suggested token')}
                </Text>
                <Text
                  weight="regular"
                  fontSize={16}
                  color={theme.secondaryText}
                  style={spacings.mbXl}
                >
                  {t('Would you like to add this token?')}
                </Text>
              </>
            )}

            <View
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderColor: theme.secondaryBorder,
                ...spacings.mb
              }}
            />
            <View style={[flexbox.directionRow, flexbox.justifySpaceBetween]}>
              <Text
                fontSize={12}
                weight="medium"
                style={[spacings.mbMd, { flex: 1 }]}
                appearance="secondaryText"
              >
                {t('ASSET/AMOUNT')}
              </Text>

              <Text
                fontSize={12}
                weight="medium"
                style={[spacings.mbMd, { flex: 0.7 }]}
                appearance="secondaryText"
              >
                {t('Price')}
              </Text>
              <Text
                fontSize={12}
                weight="medium"
                style={[
                  spacings.mbMd,
                  {
                    textAlign: 'right',
                    flex: portfolioFoundToken?.priceIn?.length ? 0.7 : 0.12
                  }
                ]}
                appearance="secondaryText"
              >
                {t('USD Value')}
              </Text>

              <View style={{ flex: portfolioFoundToken?.priceIn?.length ? 0.5 : 0 }} />
            </View>
            <View
              style={[
                flexbox.directionRow,
                flexbox.justifySpaceBetween,
                spacings.phTy,
                spacings.pvTy,
                spacings.mbTy,
                !portfolioFoundToken || !portfolioFoundToken?.priceIn?.length
                  ? {
                      borderWidth: 1,
                      borderColor: '#CA7E04',
                      borderRadius: 6
                    }
                  : {}
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={[flexbox.directionRow]}>
                  <TokenIcon
                    withContainer
                    uri={tokenData?.image}
                    networkId={tokenNetwork?.id}
                    containerHeight={40}
                    containerWidth={40}
                    width={28}
                    height={28}
                  />
                  <View style={spacings.ml}>
                    <Text weight="number_bold" fontSize={16}>
                      {tokenDetails?.balance || '0.00'} {tokenData?.symbol}
                    </Text>

                    {tokenNetwork && (
                      <Text fontSize={12}>
                        {t('on')} {tokenNetwork.name}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={{ flex: 0.7 }}>
                <Text fontSize={16} style={{ textAlign: 'left' }}>
                  {tokenDetails?.priceUSDFormatted || '-'}
                </Text>
              </View>

              <View
                style={[
                  flexbox.alignEnd,
                  { flex: portfolioFoundToken?.priceIn?.length ? 0.7 : 0.12 }
                ]}
              >
                <View style={[flexbox.directionRow, flexbox.alignEnd]}>
                  <Text weight="number_bold" fontSize={16} style={flexbox.justifyEnd}>
                    {tokenDetails?.balanceUSDFormatted || '-'}
                  </Text>
                </View>
              </View>
              {portfolioFoundToken?.priceIn?.length ? (
                <View style={[flexbox.alignEnd, { flex: 0.5 }]}>
                  <CoingeckoConfirmedBadge text={t('Confirmed')} />
                </View>
              ) : null}
            </View>

            {!portfolioFoundToken?.priceIn?.length ? (
              <Alert type="warning" title={t('This token is not listed in coingecko.')} />
            ) : null}
          </>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(WatchTokenRequestScreen)
