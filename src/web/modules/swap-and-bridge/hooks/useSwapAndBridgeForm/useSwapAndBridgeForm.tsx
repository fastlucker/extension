import React, { useCallback, useMemo, useState } from 'react'

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
  const { fromAmount, fromSelectedToken, toSelectedToken, toChainId } =
    useSwapAndBridgeControllerState()
  const [fromAmountValue, setFromAmountValue] = useState<string>(fromAmount)
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const { theme } = useTheme()
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

  const portfolioTokensList = useMemo(
    () =>
      accountPortfolio?.tokens.filter((token) => {
        const hasAmount = Number(getTokenAmount(token)) > 0

        return hasAmount && !token.flags.onGasTank && !token.flags.rewardsType
      }) || [],
    [accountPortfolio?.tokens]
  )

  const {
    options: fromTokenOptions,
    value: fromTokenValue,
    amountSelectDisabled: fromTokenAmountSelectDisabled
  } = useGetTokenSelectProps({
    tokens: portfolioTokensList,
    token: fromSelectedToken ? getTokenId(fromSelectedToken) : '',
    networks
  })

  const handleChangeFromToken = useCallback(
    (value: string) => {
      const tokenToSelect = portfolioTokensList.find(
        (tokenRes: TokenResult) => getTokenId(tokenRes) === value
      )

      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
        params: { fromSelectedToken: tokenToSelect }
      })
    },
    [dispatch, portfolioTokensList]
  )

  const toNetwork = useMemo(
    () => networks.find((n) => Number(n.chainId) === toChainId),
    [networks, toChainId]
  )

  const {
    options: toTokenOptions,
    value: toTokenValue,
    amountSelectDisabled: toTokenAmountSelectDisabled
  } = useGetTokenSelectProps({
    tokens: portfolioTokensList.filter((t) => t.networkId === toNetwork?.id),
    token: toSelectedToken ? getTokenId(toSelectedToken) : '',
    networks,
    skipNetwork: true
  })

  const handleChangeToToken = useCallback(
    (value: string) => {
      const tokenToSelect = portfolioTokensList.find(
        (tokenRes: TokenResult) => getTokenId(tokenRes) === value
      )

      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
        params: { toSelectedToken: tokenToSelect }
      })
    },
    [dispatch, portfolioTokensList]
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
