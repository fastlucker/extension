import { formatUnits } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { SocketAPIToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import NetworkIcon from '@common/components/NetworkIcon'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import useGetTokenSelectProps from '@web/modules/swap-and-bridge/hooks/useGetTokenSelectProps'
import { getTokenId } from '@web/utils/token'

const useSwapAndBridgeFrom = () => {
  const {
    fromAmount,
    fromSelectedToken,
    fromAmountFieldMode,
    toSelectedToken,
    portfolioTokenList,
    toTokenList,
    maxFromAmount,
    maxFromAmountInFiat,
    statuses,
    quote,
    fromAmountInFiat
  } = useSwapAndBridgeControllerState()
  const [fromAmountValue, setFromAmountValue] = useState<string>(fromAmount)
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const { theme } = useTheme()
  const prevFromAmount = usePrevious(fromAmount)
  const prevFromAmountInFiat = usePrevious(fromAmountInFiat)

  useEffect(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_INIT'
    })
  }, [dispatch])

  useEffect(() => {
    if (
      fromAmountFieldMode === 'fiat' &&
      prevFromAmountInFiat !== fromAmountInFiat &&
      fromAmountInFiat !== fromAmountValue
    ) {
      setFromAmountValue(fromAmountInFiat)
    }
  }, [fromAmountInFiat, fromAmountValue, prevFromAmountInFiat, fromAmountFieldMode])

  useEffect(() => {
    if (fromAmountFieldMode === 'token') setFromAmountValue(fromAmount)
    if (fromAmountFieldMode === 'fiat') setFromAmountValue(fromAmountInFiat)
  }, [fromAmountFieldMode, fromAmount, fromAmountInFiat])

  useEffect(() => {
    if (
      fromAmountFieldMode === 'token' &&
      prevFromAmount !== fromAmount &&
      fromAmount !== fromAmountValue
    ) {
      setFromAmountValue(fromAmount)
    }
  }, [fromAmount, fromAmountValue, prevFromAmount, fromAmountFieldMode])

  const onFromAmountChange = useCallback(
    (value: string) => {
      setFromAmountValue(value)
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
        params: { fromAmount: value }
      })
    },
    [dispatch]
  )

  useEffect(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_PORTFOLIO_TOKEN_LIST',
      params:
        accountPortfolio?.tokens.filter((token) => {
          const hasAmount = Number(getTokenAmount(token)) > 0

          return hasAmount && !token.flags.onGasTank && !token.flags.rewardsType
        }) || []
    })
  }, [accountPortfolio?.tokens, dispatch])

  const {
    options: fromTokenOptions,
    value: fromTokenValue,
    amountSelectDisabled: fromTokenAmountSelectDisabled
  } = useGetTokenSelectProps({
    tokens: portfolioTokenList,
    token: fromSelectedToken ? getTokenId(fromSelectedToken) : '',
    networks
  })

  const handleChangeFromToken = useCallback(
    (value: string) => {
      const tokenToSelect = portfolioTokenList.find(
        (tokenRes: TokenResult) => getTokenId(tokenRes) === value
      )

      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
        params: { fromSelectedToken: tokenToSelect }
      })
    },
    [dispatch, portfolioTokenList]
  )

  const {
    options: toTokenOptions,
    value: toTokenValue,
    amountSelectDisabled: toTokenAmountSelectDisabled
  } = useGetTokenSelectProps({
    tokens: toTokenList,
    token: toSelectedToken ? getTokenId(toSelectedToken) : '',
    networks,
    isLoading: !toTokenList.length && statuses.updateToTokenList !== 'INITIAL',
    skipNetwork: true
  })

  const handleChangeToToken = useCallback(
    (value: string) => {
      const tokenToSelect = toTokenList.find((t: SocketAPIToken) => getTokenId(t) === value)

      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
        params: { toSelectedToken: tokenToSelect }
      })
    },
    [dispatch, toTokenList]
  )

  const toNetworksOptions: SelectValue[] = useMemo(
    () =>
      networks.map((n) => ({
        value: Number(n.chainId),
        label: <Text weight="medium">{n.name}</Text>,
        icon: (
          <NetworkIcon id={n.id} style={{ backgroundColor: theme.primaryBackground }} size={28} />
        )
      })),
    [networks, theme]
  )

  const handleSetToNetworkValue = useCallback(
    (networkOption: SelectValue) => {
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
        params: {
          toChainId: networks.filter((net) => Number(net.chainId) === networkOption.value)[0]
            .chainId
        }
      })
    },
    [networks, dispatch]
  )

  const handleSwitchFromAmountFieldMode = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
      params: { fromAmountFieldMode: fromAmountFieldMode === 'token' ? 'fiat' : 'token' }
    })
  }, [fromAmountFieldMode, dispatch])

  const handleSetMaxFromAmount = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
      params: { fromAmount: fromAmountFieldMode === 'token' ? maxFromAmount : maxFromAmountInFiat }
    })
  }, [fromAmountFieldMode, maxFromAmount, maxFromAmountInFiat, dispatch])

  const handleSubmitForm = useCallback(() => {}, [])

  const formattedToAmount = useMemo(() => {
    if (!quote || !quote.route || !quote?.toAsset?.decimals) return '0'

    return `${formatUnits(quote.route.toAmount, quote.toAsset.decimals)}`
  }, [quote])

  return {
    fromAmountValue,
    onFromAmountChange,
    fromTokenAmountSelectDisabled,
    fromTokenOptions,
    fromTokenValue,
    handleChangeFromToken,
    toNetworksOptions,
    handleSetToNetworkValue,
    toTokenAmountSelectDisabled,
    toTokenOptions,
    toTokenValue,
    handleChangeToToken,
    handleSwitchFromAmountFieldMode,
    handleSetMaxFromAmount,
    handleSubmitForm,
    formattedToAmount
  }
}

export default useSwapAndBridgeFrom
