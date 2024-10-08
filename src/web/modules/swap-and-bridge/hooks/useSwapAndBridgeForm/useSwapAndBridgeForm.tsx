import { formatUnits, getAddress } from 'ethers'
import { debounce } from 'lodash'
import { nanoid } from 'nanoid'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import { SocketAPIToken } from '@ambire-common/interfaces/swapAndBridge'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import NetworkIcon from '@common/components/NetworkIcon'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import formatDecimals from '@common/utils/formatDecimals'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import useGetTokenSelectProps from '@web/modules/swap-and-bridge/hooks/useGetTokenSelectProps'
import { getTokenId } from '@web/utils/token'

const sessionId = nanoid()

const useSwapAndBridgeForm = () => {
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
    fromAmountInFiat,
    activeRoutes,
    formStatus,
    toChainId
  } = useSwapAndBridgeControllerState()
  const { selectedAccount } = useAccountsControllerState()
  const [fromAmountValue, setFromAmountValue] = useState<string>(fromAmount)
  const debouncedDispatchUpdateFormRef = useRef<_.DebouncedFunc<(value: string) => void>>()
  const [followUpTransactionConfirmed, setFollowUpTransactionConfirmed] = useState<boolean>(false)
  const [settingModalVisible, setSettingsModalVisible] = useState<boolean>(false)
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const { theme } = useTheme()
  const prevFromAmount = usePrevious(fromAmount)
  const prevFromAmountInFiat = usePrevious(fromAmountInFiat)

  useEffect(() => {
    dispatch({ type: 'SWAP_AND_BRIDGE_CONTROLLER_INIT_FORM', params: { sessionId } })
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

      // Debounce dispatching an update to prevent too many updates / requests
      if (!debouncedDispatchUpdateFormRef.current) {
        debouncedDispatchUpdateFormRef.current = debounce((latestFromAmount: string) => {
          dispatch({
            type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
            params: { fromAmount: latestFromAmount }
          })
        }, 750)
      }

      debouncedDispatchUpdateFormRef.current(value) // Use the debounced function to dispatch the action
    },
    [dispatch]
  )

  useEffect(() => {
    if (followUpTransactionConfirmed && formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit) {
      setFollowUpTransactionConfirmed(false)
    }
  }, [followUpTransactionConfirmed, formStatus])

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
        value: n.id,
        label: <Text weight="medium">{n.name}</Text>,
        icon: (
          <NetworkIcon id={n.id} style={{ backgroundColor: theme.primaryBackground }} size={28} />
        )
      })),
    [networks, theme]
  )

  const getToNetworkSelectValue = useMemo(() => {
    const network = networks.find((n) => Number(n.chainId) === toChainId)
    if (!network) return toNetworksOptions[0]

    return toNetworksOptions.filter((opt) => opt.value === network.id)[0]
  }, [networks, toChainId, toNetworksOptions])

  const handleSetToNetworkValue = useCallback(
    (networkOption: SelectValue) => {
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
        params: {
          toChainId: networks.filter((net) => net.id === networkOption.value)[0].chainId
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

  const handleSwitchFromAndToTokens = useCallback(
    () =>
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_SWITCH_FROM_AND_TO_TOKENS'
      }),
    [dispatch]
  )

  const handleSetMaxFromAmount = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
      params: { fromAmount: fromAmountFieldMode === 'token' ? maxFromAmount : maxFromAmountInFiat }
    })
  }, [fromAmountFieldMode, maxFromAmount, maxFromAmountInFiat, dispatch])

  const formattedToAmount = useMemo(() => {
    if (!quote || !quote.route || !quote?.toAsset?.decimals) return '0'

    return `${formatDecimals(
      Number(formatUnits(quote.route.toAmount, quote.toAsset.decimals)),
      'precise'
    )}`
  }, [quote])

  const shouldConfirmFollowUpTransactions = useMemo(() => {
    if (!quote?.route) return false

    if (quote.route.isOnlySwapRoute) return false

    const stepTypes = quote.routeSteps.map((s) => s.type)

    return stepTypes.includes('bridge') && stepTypes.includes('swap')
  }, [quote])

  const handleSubmitForm = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_SUBMIT_FORM'
    })
  }, [dispatch])

  const handleToggleSettingsMenu = useCallback(() => {
    setSettingsModalVisible((p) => !p)
  }, [])

  const pendingRoutes = useMemo(() => {
    return (
      (activeRoutes || [])
        .filter((r) => getAddress(r.route.userAddress) === selectedAccount)
        .reverse() || []
    )
  }, [activeRoutes, selectedAccount])

  return {
    sessionId,
    fromAmountValue,
    onFromAmountChange,
    fromTokenAmountSelectDisabled,
    fromTokenOptions,
    fromTokenValue,
    handleChangeFromToken,
    toNetworksOptions,
    getToNetworkSelectValue,
    handleSetToNetworkValue,
    toTokenAmountSelectDisabled,
    toTokenOptions,
    toTokenValue,
    handleChangeToToken,
    handleSwitchFromAmountFieldMode,
    handleSetMaxFromAmount,
    handleSubmitForm,
    formattedToAmount,
    shouldConfirmFollowUpTransactions,
    followUpTransactionConfirmed,
    setFollowUpTransactionConfirmed,
    settingModalVisible,
    handleToggleSettingsMenu,
    handleSwitchFromAndToTokens,
    pendingRoutes
  }
}

export default useSwapAndBridgeForm
