import { getAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { DappRequestAction } from '@ambire-common/controllers/actions/actions'
import { NetworkId } from '@ambire-common/interfaces/network'
import { getNetworksWithFailedRPC } from '@ambire-common/libs/networks/networks'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import Alert from '@common/components/Alert/Alert'
import NetworkBadge from '@common/components/NetworkBadge'
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
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useProvidersControllerState from '@web/hooks/useProvidersControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import ActionFooter from '@web/modules/action-requests/components/ActionFooter'
import {
  getTokenEligibility,
  getTokenFromPortfolio,
  getTokenFromPreferences,
  getTokenFromTemporaryTokens,
  handleTokenIsInPortfolio,
  selectNetwork
} from '@web/modules/action-requests/screens/WatchTokenRequestScreen/utils'

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
  const state = useActionsControllerState()
  const { temporaryTokens, validTokens, tokenPreferences } = usePortfolioControllerState()
  const { portfolio: selectedAccountPortfolio } = useSelectedAccountControllerState()
  const { networks } = useNetworksControllerState()
  const { providers } = useProvidersControllerState()

  const dappAction = useMemo(() => {
    if (state.currentAction?.type !== 'dappRequest') return undefined

    return state.currentAction as DappRequestAction
  }, [state.currentAction])

  const userRequest = useMemo(() => {
    if (!dappAction) return undefined
    if (dappAction.userRequest.action.kind !== 'walletWatchAsset') return undefined

    return dappAction.userRequest
  }, [dappAction])

  const tokenData = userRequest?.action?.params?.options
  const origin = userRequest?.session?.origin
  const network =
    networks.find((n) => n.explorerUrl === origin) ||
    networks.find((n) => n.id === tokenData?.networkId)
  const [showAlreadyInPortfolioMessage, setShowAlreadyInPortfolioMessage] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tokenNetwork, setTokenNetwork] = useState(network)
  const [isTemporaryTokenRequested, setTemporaryTokenRequested] = useState(false)

  const isLoadingTemporaryToken = useMemo(
    () => tokenNetwork?.id && temporaryTokens?.[tokenNetwork?.id]?.isLoading,
    [tokenNetwork?.id, temporaryTokens]
  )

  const networkWithFailedRPC =
    tokenNetwork?.id &&
    getNetworksWithFailedRPC({ providers }).filter(
      (networkId: NetworkId) => tokenNetwork?.id === networkId
    )

  const tokenTypeEligibility = useMemo(
    () => getTokenEligibility(tokenData, validTokens, tokenNetwork),
    [validTokens, tokenData, tokenNetwork]
  )
  const handleCancel = useCallback(() => {
    if (!dappAction) return

    dispatch({
      type: 'MAIN_CONTROLLER_REJECT_USER_REQUEST',
      params: { err: t('User rejected the request.'), id: dappAction.id }
    })
  }, [dappAction, t, dispatch])

  // Handle the case its already in token preferences
  const tokenInPreferences = useMemo(
    () => getTokenFromPreferences(tokenData, tokenNetwork, tokenPreferences),
    [tokenPreferences, tokenData, tokenNetwork]
  )

  const temporaryToken = useMemo(
    () => getTokenFromTemporaryTokens(temporaryTokens, tokenData, tokenNetwork),
    [temporaryTokens, tokenData, tokenNetwork]
  )

  const portfolioToken = useMemo(
    () =>
      getTokenFromPortfolio(tokenData, tokenNetwork, selectedAccountPortfolio, tokenInPreferences),
    [selectedAccountPortfolio, tokenInPreferences, tokenNetwork, tokenData]
  )

  const handleTokenType = (networkId: NetworkId) => {
    dispatch({
      type: 'PORTFOLIO_CONTROLLER_CHECK_TOKEN',
      params: { token: { address: tokenData?.address, networkId } }
    })
  }

  const handleSelectNetwork = useCallback(async () => {
    await selectNetwork(
      network,
      tokenNetwork,
      tokenData,
      networks,
      validTokens,
      setIsLoading,
      setTokenNetwork,
      handleTokenType,
      providers
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    network,
    tokenNetwork,
    tokenData,
    networks,
    validTokens,
    setIsLoading,
    setTokenNetwork,
    handleTokenType,
    providers,
    tokenTypeEligibility
  ])

  useEffect(() => {
    const handleEffect = async () => {
      handleSelectNetwork()
      if (tokenNetwork) {
        // Check if token is already in portfolio
        const isTokenInHints = await handleTokenIsInPortfolio(
          tokenInPreferences,
          selectedAccountPortfolio,
          tokenNetwork,
          tokenData
        )
        if (isTokenInHints) {
          setIsLoading(false)
          setShowAlreadyInPortfolioMessage(true)
        }
        if (!temporaryToken) {
          // Check if token is eligible to add in portfolio
          if (tokenData && !tokenTypeEligibility) {
            handleTokenType(tokenNetwork?.id)
          }

          if (tokenTypeEligibility && !isTokenInHints && !isTemporaryTokenRequested) {
            setTemporaryTokenRequested(true)
            dispatch({
              type: 'PORTFOLIO_CONTROLLER_GET_TEMPORARY_TOKENS',
              params: {
                networkId: tokenNetwork?.id,
                additionalHint: getAddress(tokenData?.address)
              }
            })
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
    tokenInPreferences,
    selectedAccountPortfolio,
    validTokens
  ])

  const handleAddToken = useCallback(async () => {
    if (!dappAction) return
    if (!tokenNetwork?.id) return

    const token: CustomToken = {
      address: getAddress(tokenData.address),
      symbol: tokenData?.symbol,
      decimals: Number(tokenData?.decimals),
      standard: 'ERC20',
      networkId: tokenNetwork?.id
    }

    dispatch({
      type: 'PORTFOLIO_CONTROLLER_UPDATE_TOKEN_PREFERENCES',
      params: { token }
    })

    dispatch({
      type: 'MAIN_CONTROLLER_RESOLVE_USER_REQUEST',
      params: { data: null, id: dappAction.id }
    })
  }, [dispatch, dappAction, tokenData, tokenNetwork])

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
      header={<HeaderAccountAndNetworkInfo />}
      footer={
        <ActionFooter
          onReject={handleCancel}
          onResolve={handleAddToken}
          resolveButtonText={isLoading ? t('Adding token...') : t('Add token')}
          resolveDisabled={
            isLoading || showAlreadyInPortfolioMessage || (!tokenTypeEligibility && !temporaryToken)
          }
        />
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg}>
        {(!tokenTypeEligibility &&
          tokenTypeEligibility !== undefined &&
          !temporaryToken &&
          !isLoadingTemporaryToken) ||
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
                <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbLg]}>
                  <Text weight="medium" fontSize={20} style={spacings.mrTy}>
                    {t('Add suggested token on')}
                  </Text>
                  <NetworkBadge networkId={tokenNetwork?.id} />
                </View>
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
            <TokenHeader
              showAlreadyInPortfolioMessage={showAlreadyInPortfolioMessage}
              temporaryToken={portfolioToken || temporaryToken}
            />
            <Token
              tokenData={tokenData}
              tokenNetwork={tokenNetwork}
              temporaryToken={portfolioToken || temporaryToken}
              isLoading={isLoading}
              showAlreadyInPortfolioMessage={showAlreadyInPortfolioMessage}
            />
          </>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(WatchTokenRequestScreen)
