import { getAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/networkDescriptor'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { getNetworksWithFailedRPC } from '@ambire-common/libs/settings/settings'
import CloseIcon from '@common/assets/svg/CloseIcon'
import Alert from '@common/components/Alert/Alert'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import {
  getTokenEligibility,
  getTokenFromPortfolio,
  getTokenFromPreferences,
  getTokenFromTemporaryTokens,
  handleTokenIsInPortfolio,
  selectNetwork
} from '@web/modules/notification-requests/screens/WatchTokenRequestScreen/utils'

import Token from './components/Token'
import TokenHeader from './components/TokenHeader'

export type TokenData = {
  address: string
  name: string
  symbol: string
  decimals: number
  image: string
}

const WatchTokenRequestScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const state = useNotificationControllerState()
  const portfolio = usePortfolioControllerState()
  const { networks, providers } = useSettingsControllerState()

  const tokenData = state?.currentNotificationRequest?.params?.data?.options
  const origin = state?.currentNotificationRequest?.params?.session?.origin
  const network =
    networks.find((n) => n.explorerUrl === origin) ||
    networks.find((n) => n.id === tokenData?.networkId)
  const [showAlreadyInPortfolioMessage, setShowAlreadyInPortfolioMessage] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tokenNetwork, setTokenNetwork] = useState(network)
  const [isTemporaryTokenRequested, setTemporaryTokenRequested] = useState(false)

  const networkWithFailedRPC = tokenNetwork?.id && getNetworksWithFailedRPC({ providers }).filter((networkId: NetworkId) =>
    tokenNetwork?.id === networkId
  )


  const tokenTypeEligibility = useMemo(
    () => getTokenEligibility(tokenData, portfolio, tokenNetwork),
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
    () => getTokenFromPreferences(tokenData, tokenNetwork, portfolio.state.tokenPreferences),
    [portfolio.state.tokenPreferences, tokenData, tokenNetwork]
  )

  const temporaryToken = useMemo(
    () => getTokenFromTemporaryTokens(portfolio, tokenData, tokenNetwork),
    [portfolio, tokenData, tokenNetwork]
  )

  const portfolioToken = useMemo(
    () =>
      getTokenFromPortfolio(
        tokenData,
        tokenNetwork,
        portfolio?.accountPortfolio,
        tokenInPreferences
      ),
    [portfolio, tokenInPreferences, tokenNetwork, tokenData]
  )

  const handleTokenType = async (networkId: NetworkId) => {
    await portfolio.checkToken({ address: tokenData?.address, networkId })
  }

  useEffect(() => {
    const handleEffect = async () => {
      await selectNetwork(
        network,
        tokenNetwork,
        tokenData,
        networks,
        portfolio,
        setIsLoading,
        setTokenNetwork,
        handleTokenType
      )

      if (tokenNetwork && !temporaryToken) {
        // Check if token is eligible to add in portfolio
        if (tokenData && !tokenTypeEligibility) {
          await handleTokenType(tokenNetwork?.id)
        }

        if (tokenTypeEligibility) {
          // Check if token is already in portfolio
          const isTokenInHints = await handleTokenIsInPortfolio(
            tokenInPreferences,
            portfolio.accountPortfolio,
            tokenNetwork,
            tokenData
          )
          if (isTokenInHints) {
            setIsLoading(false)
            setShowAlreadyInPortfolioMessage(true)
          } else if (!temporaryToken && !isTemporaryTokenRequested) {
            setTemporaryTokenRequested(true)
            portfolio.getTemporaryTokens(tokenNetwork?.id, getAddress(tokenData?.address))
          }
        }
      }
    }

    handleEffect().catch(() => setIsLoading(false))

    if (tokenTypeEligibility === false || !!temporaryToken) {
      setIsLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    network,
    tokenData,
    tokenNetwork,
    networks,
    tokenTypeEligibility,
    temporaryToken,
    setIsLoading,
    tokenInPreferences,
    portfolio
  ])

  const handleAddToken = useCallback(async () => {
    if (!tokenNetwork?.id) return
    const token: CustomToken = {
      address: getAddress(tokenData.address),
      name: tokenData?.name,
      symbol: tokenData?.symbol,
      decimals: tokenData?.decimals,
      standard: 'ERC20',
      networkId: tokenNetwork?.id
    }

    await portfolio.updateTokenPreferences(token)
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST',
      params: { data: null }
    })
  }, [dispatch, tokenData, tokenNetwork, portfolio])

  if (networkWithFailedRPC && networkWithFailedRPC?.length > 0 && !!temporaryToken) {
    return <Alert type="error" title={t('This network RPC is failing')} />
  }
  if (isLoading && tokenTypeEligibility === undefined) {
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
        {(!tokenTypeEligibility && tokenTypeEligibility !== undefined && !temporaryToken) ||
        (!tokenNetwork?.id && !isLoading) ? (
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
            <TokenHeader temporaryToken={temporaryToken || portfolioToken} />
            <Token
              tokenData={tokenData}
              tokenNetwork={tokenNetwork}
              temporaryToken={temporaryToken || portfolioToken}
              isLoading={isLoading}
            />
          </>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(WatchTokenRequestScreen)
