import { getAddress, parseUnits } from 'ethers'
import { nanoid } from 'nanoid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useModalize } from 'react-native-modalize'

import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import { AccountOpAction } from '@ambire-common/interfaces/actions'
import { getIsTokenEligibleForSwapAndBridge } from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import { getSanitizedAmount } from '@ambire-common/libs/transfer/amount'
import useGetTokenSelectProps from '@common/hooks/useGetTokenSelectProps'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import { getTokenId } from '@web/utils/token'
import { getUiType } from '@web/utils/uiType'

type SessionId = ReturnType<typeof nanoid>

const { isPopup } = getUiType()

const useSwapAndBridgeForm = () => {
  const {
    fromAmount,
    fromSelectedToken,
    fromAmountFieldMode,
    portfolioTokenList,
    isTokenListLoading,
    quote,
    fromAmountInFiat,
    activeRoutes,
    formStatus,
    supportedChainIds,
    updateQuoteStatus,
    sessionIds
  } = useSwapAndBridgeControllerState()
  const { account, portfolio } = useSelectedAccountControllerState()
  const [fromAmountValue, setFromAmountValue] = useState<string>(fromAmount)
  const [followUpTransactionConfirmed, setFollowUpTransactionConfirmed] = useState<boolean>(false)
  const [isAutoSelectRouteDisabled, setIsAutoSelectRouteDisabled] = useState<boolean>(false)
  /**
   * @deprecated - the settings menu is not used anymore
   */
  const [settingModalVisible, setSettingsModalVisible] = useState<boolean>(false)
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()
  const { searchParams, setSearchParams } = useNavigation()
  const prevFromAmount = usePrevious(fromAmount)
  const prevFromAmountInFiat = usePrevious(fromAmountInFiat)
  const { ref: routesModalRef, open: openRoutesModal, close: closeRoutesModal } = useModalize()
  const {
    ref: estimationModalRef,
    open: openEstimationModal,
    close: closeEstimationModal
  } = useModalize()
  const {
    ref: priceImpactModalRef,
    open: openPriceImpactModal,
    close: closePriceImpactModal
  } = useModalize()
  const { ref: batchModalRef, open: openBatchModal, close: closeBatchModal } = useModalize()
  const { actionsQueue } = useActionsControllerState()
  const sessionIdsRequestedToBeInit = useRef<SessionId[]>([])
  const sessionId = useMemo(() => {
    if (isPopup) return 'popup'

    return nanoid()
  }, []) // purposely, so it is unique per hook lifetime

  const mainAccountOpActions = useMemo(() => {
    if (!account) return []
    if (!fromSelectedToken) return []
    return (actionsQueue.filter((a) => a.type === 'accountOp') as AccountOpAction[]).filter(
      (action) =>
        action.accountOp.accountAddr === account.addr &&
        action.accountOp.chainId.toString() === fromSelectedToken.chainId.toString()
    )
  }, [account, fromSelectedToken, actionsQueue])
  const isOneClickModeAllowed = useMemo(() => {
    return mainAccountOpActions.length === 0
  }, [mainAccountOpActions])

  const handleSetFromAmount = (val: string) => {
    setFromAmountValue(val)
    setIsAutoSelectRouteDisabled(false)
  }

  useEffect(() => {
    if (
      searchParams.get('address') &&
      searchParams.get('chainId') &&
      !!portfolio?.isReadyToVisualize &&
      (sessionIds || []).includes(sessionId)
    ) {
      const tokenToSelectOnInit = portfolio.tokens.find(
        (t) =>
          t.address === searchParams.get('address') &&
          t.chainId.toString() === searchParams.get('chainId') &&
          getIsTokenEligibleForSwapAndBridge(t)
      )

      if (tokenToSelectOnInit) {
        dispatch({
          type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
          params: { fromSelectedToken: tokenToSelectOnInit }
        })
        // Reset search params once updated in the state
        setSearchParams((prev) => {
          prev.delete('address')
          prev.delete('chainId')
          return prev
        })
      }
    }
  }, [
    dispatch,
    setSearchParams,
    portfolio?.isReadyToVisualize,
    portfolio.tokens,
    searchParams,
    sessionIds,
    sessionId
  ])

  // init session
  useEffect(() => {
    // Init each session only once
    if (sessionIdsRequestedToBeInit.current.includes(sessionId)) return

    dispatch({ type: 'SWAP_AND_BRIDGE_CONTROLLER_INIT_FORM', params: { sessionId } })
    sessionIdsRequestedToBeInit.current.push(sessionId)
    setSearchParams((prev) => {
      prev.set('sessionId', sessionId)
      return prev
    })
  }, [dispatch, sessionId, sessionIdsRequestedToBeInit, setSearchParams])

  // remove session - this will be triggered only
  // when navigation to another screen internally in the extension
  // the session removal when the window is forcefully closed is handled
  // in the port.onDisconnect callback in the background
  useEffect(() => {
    return () => {
      dispatch({ type: 'SWAP_AND_BRIDGE_CONTROLLER_UNLOAD_SCREEN', params: { sessionId } })
    }
  }, [dispatch, sessionId])

  useEffect(() => {
    if (
      fromAmountFieldMode === 'fiat' &&
      prevFromAmountInFiat !== fromAmountInFiat &&
      fromAmountInFiat !== fromAmountValue
    ) {
      handleSetFromAmount(fromAmountInFiat)
    }
  }, [fromAmountInFiat, fromAmountValue, prevFromAmountInFiat, fromAmountFieldMode])

  useEffect(() => {
    if (fromAmountFieldMode === 'token') handleSetFromAmount(fromAmount)
    if (fromAmountFieldMode === 'fiat') handleSetFromAmount(fromAmountInFiat)
  }, [fromAmountFieldMode, fromAmount, fromAmountInFiat])

  useEffect(() => {
    if (
      fromAmountFieldMode === 'token' &&
      prevFromAmount !== fromAmount &&
      fromAmount !== fromAmountValue
    ) {
      handleSetFromAmount(fromAmount)
    }
  }, [fromAmount, fromAmountValue, prevFromAmount, fromAmountFieldMode])

  const onFromAmountChange = useCallback(
    (value: string) => {
      handleSetFromAmount(value)
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
        params: { fromAmount: value }
      })
    },
    [dispatch]
  )

  useEffect(() => {
    if (
      followUpTransactionConfirmed &&
      (formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit || updateQuoteStatus === 'LOADING')
    ) {
      setFollowUpTransactionConfirmed(false)
    }
  }, [followUpTransactionConfirmed, formStatus, updateQuoteStatus])

  const {
    options: fromTokenOptions,
    value: fromTokenValue,
    amountSelectDisabled: fromTokenAmountSelectDisabled
  } = useGetTokenSelectProps({
    tokens: portfolioTokenList,
    token: fromSelectedToken ? getTokenId(fromSelectedToken, networks) : '',
    isLoading: isTokenListLoading,
    networks,
    supportedChainIds
  })

  /**
   * @deprecated - no operations should require follow up transactions
   */
  const shouldConfirmFollowUpTransactions = useMemo(() => {
    if (!quote?.selectedRoute) return false

    if (quote.selectedRoute.isOnlySwapRoute) return false

    const stepTypes = quote.selectedRouteSteps.map((s) => s.type)

    return (
      stepTypes.includes('middleware') &&
      stepTypes.includes('swap') &&
      formStatus === SwapAndBridgeFormStatus.ReadyToSubmit
    )
  }, [quote, formStatus])

  const highPriceImpactInPercentage = useMemo(() => {
    if (updateQuoteStatus === 'LOADING') return null

    if (formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit) return null

    if (!quote || !quote.selectedRoute) return null

    let inputValueInUsd = 0

    try {
      inputValueInUsd = Number(fromAmountInFiat)
    } catch (error) {
      // silent fail
    }
    if (!inputValueInUsd) return null

    if (inputValueInUsd <= quote.selectedRoute.outputValueInUsd) return null

    if (!fromSelectedToken) return null

    try {
      const sanitizedFromAmount = getSanitizedAmount(fromAmount, fromSelectedToken!.decimals)

      const bigintFromAmount = parseUnits(sanitizedFromAmount, fromSelectedToken!.decimals)

      if (bigintFromAmount !== BigInt(quote.selectedRoute.fromAmount)) return null

      const difference = Math.abs(inputValueInUsd - quote.selectedRoute.outputValueInUsd)

      const percentageDiff = (difference / inputValueInUsd) * 100

      // show the warning banner only if the percentage diff is higher than 5%
      return percentageDiff < 5 ? null : percentageDiff
    } catch (error) {
      return null
    }
  }, [quote, formStatus, fromAmount, fromAmountInFiat, fromSelectedToken, updateQuoteStatus])

  const acknowledgeHighPriceImpact = useCallback(() => {
    closePriceImpactModal()
    openEstimationModal()
  }, [closePriceImpactModal, openEstimationModal])

  const handleSubmitForm = useCallback(
    (isOneClickMode: boolean) => {
      if (highPriceImpactInPercentage) {
        openPriceImpactModal()
        return
      }
      if (!quote || !quote.selectedRoute) return

      // open the estimation modal on one click method;
      // build/add a swap user request on batch
      if (isOneClickMode) {
        openEstimationModal()
      } else {
        dispatch({
          type: 'SWAP_AND_BRIDGE_CONTROLLER_BUILD_USER_REQUEST'
        })
        openBatchModal()
      }
    },
    [
      dispatch,
      highPriceImpactInPercentage,
      openBatchModal,
      openEstimationModal,
      openPriceImpactModal,
      quote
    ]
  )

  /**
   * @deprecated - the settings menu is not used anymore
   */
  const handleToggleSettingsMenu = useCallback(() => {
    setSettingsModalVisible((p) => !p)
  }, [])

  const pendingRoutes = useMemo(() => {
    return (
      (activeRoutes || [])
        .filter((r) => r.route && getAddress(r.route.userAddress) === account?.addr)
        .reverse() || []
    )
  }, [activeRoutes, account])

  return {
    sessionId,
    fromAmountValue,
    onFromAmountChange,
    fromTokenAmountSelectDisabled,
    fromTokenOptions,
    fromTokenValue,
    handleSubmitForm,
    shouldConfirmFollowUpTransactions,
    followUpTransactionConfirmed,
    setFollowUpTransactionConfirmed,
    highPriceImpactInPercentage,
    priceImpactModalRef,
    closePriceImpactModal,
    acknowledgeHighPriceImpact,
    settingModalVisible,
    handleToggleSettingsMenu,
    pendingRoutes,
    routesModalRef,
    openRoutesModal,
    closeRoutesModal,
    estimationModalRef,
    closeEstimationModal,
    isAutoSelectRouteDisabled,
    setIsAutoSelectRouteDisabled,
    isOneClickModeAllowed,
    closeBatchModal,
    batchModalRef
  }
}

export default useSwapAndBridgeForm
