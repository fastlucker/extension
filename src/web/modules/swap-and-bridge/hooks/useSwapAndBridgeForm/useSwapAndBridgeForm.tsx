import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { SocketAPIToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import NetworkIcon from '@common/components/NetworkIcon'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
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
    toSelectedToken,
    portfolioTokenList,
    toTokenList,
    statuses
  } = useSwapAndBridgeControllerState()
  const [fromAmountValue, setFromAmountValue] = useState<string>(fromAmount)
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const { theme } = useTheme()

  useEffect(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_INIT'
    })
  }, [dispatch])

  const onFromAmountChange = useCallback(
    (value: string) => {
      setFromAmountValue(value)
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
        params: { fromAmount: value }
      })
    },
    [dispatch]
  )

  useEffect(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
      params: {
        portfolioTokenList:
          accountPortfolio?.tokens.filter((token) => {
            const hasAmount = Number(getTokenAmount(token)) > 0

            return hasAmount && !token.flags.onGasTank && !token.flags.rewardsType
          }) || []
      }
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
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
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
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
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
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
        params: {
          toChainId: networks.filter((net) => Number(net.chainId) === networkOption.value)[0]
            .chainId
        }
      })
    },
    [networks, dispatch]
  )

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
    handleChangeToToken
  }
}

export default useSwapAndBridgeFrom
