import React, { createContext, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { TransferController } from '@ambire-common/controllers/transfer/transfer'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import { sortPortfolioTokenList } from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import Spinner from '@common/components/Spinner'
import useRoute from '@common/hooks/useRoute'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useControllerState from '@web/hooks/useControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useDeepMemo from '@common/hooks/useDeepMemo'

type ContextReturn = {
  state: TransferController
  tokens: TokenResult[]
}

const TransferControllerStateContext = createContext<ContextReturn>({} as ContextReturn)

export const getInfoFromSearch = (search: string | undefined) => {
  if (!search) return null

  const params = new URLSearchParams(search)

  return {
    addr: params.get('address'),
    chainId: params.get('chainId')
  }
}

const TransferControllerStateProvider = ({
  children,
  isTopUp
}: {
  children: any
  isTopUp?: boolean
}) => {
  const controller = 'transfer'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
    }
  }, [dispatch, mainState.isReady, state])

  const memoizedState = useDeepMemo(state, controller)

  const { account } = useSelectedAccountControllerState()
  const { networks } = useNetworksControllerState()
  const { search } = useRoute()

  const { portfolio } = useSelectedAccountControllerState()
  const selectedTokenFromUrl = useMemo(() => getInfoFromSearch(search), [search])

  const tokens = useMemo(
    () =>
      sortPortfolioTokenList(
        portfolio?.tokens.filter((token) => {
          const hasAmount = Number(getTokenAmount(token)) > 0

          if (isTopUp) {
            const tokenNetwork = networks.find((network) => network.chainId === token.chainId)

            return (
              hasAmount &&
              tokenNetwork?.hasRelayer &&
              token.flags.canTopUpGasTank &&
              !token.flags.onGasTank
            )
          }

          return hasAmount && !token.flags.onGasTank && !token.flags.rewardsType
        }) || []
      ),
    [portfolio?.tokens, networks, isTopUp]
  )

  useEffect(() => {
    if (!account) return

    dispatch({
      type: 'TRANSFER_CONTROLLER_UPDATE_FORM',
      params: { formValues: { selectedAccountData: account } }
    })
  }, [account, dispatch])

  useEffect(() => {
    if (!memoizedState.selectedToken?.address || !memoizedState) return

    // If a token is already selected, we should retrieve its latest value from tokens.
    // This is important because the token amount is likely to change,
    // especially when initiating a transfer or adding a new one to the queue.
    // As a result, the token `amountPostSimulation` may differ, and we need to update the available token balance accordingly.
    const selectedToken = tokens.find(
      (token) =>
        token.address === memoizedState.selectedToken?.address &&
        token.chainId === memoizedState.selectedToken?.chainId
    )

    // It has a scenario where no token is provided view URL parameters but only isTopUp and the selectedToken will be undefined
    // In that case we do not update the selected token
    if (selectedToken) {
      dispatch({
        type: 'TRANSFER_CONTROLLER_UPDATE_FORM',
        params: { formValues: { selectedToken }, options: { shouldPersist: false } }
      })
    }
  }, [selectedTokenFromUrl?.addr, selectedTokenFromUrl?.chainId, tokens, memoizedState, dispatch])

  useEffect(() => {
    if (!memoizedState) return

    dispatch({
      type: 'TRANSFER_CONTROLLER_UPDATE_FORM',
      params: { formValues: { isTopUp } }
    })
  }, [isTopUp, memoizedState, dispatch])

  // If the user sends the max amount of a token it will disappear from the list of tokens
  // and we need to select another token
  useEffect(() => {
    if (!state.selectedToken?.address || !memoizedState) return
    const isSelectedTokenNetworkLoading =
      portfolio.pending[state.selectedToken.chainId.toString()]?.isLoading ||
      portfolio.latest[state.selectedToken.chainId.toString()]?.isLoading

    if (isSelectedTokenNetworkLoading) return

    const isSelectedTokenInTokens = tokens.find(
      (token) =>
        token.address === state.selectedToken?.address &&
        token.chainId === state.selectedToken?.chainId &&
        token.flags.rewardsType === state.selectedToken?.flags.rewardsType
    )

    if (isSelectedTokenInTokens) return

    dispatch({
      type: 'TRANSFER_CONTROLLER_UPDATE_FORM',
      params: { formValues: { selectedToken: tokens[0] }, options: { shouldPersist: false } }
    })
  }, [
    portfolio.latest,
    portfolio.pending,
    state.selectedToken?.address,
    state.selectedToken?.flags.rewardsType,
    state.selectedToken?.chainId,
    tokens,
    memoizedState,
    dispatch
  ])

  return (
    <TransferControllerStateContext.Provider
      value={useMemo(() => ({ state: memoizedState, tokens }), [memoizedState, tokens])}
    >
      {Object.keys(memoizedState).length ? (
        children
      ) : (
        <View style={[flexbox.flex1, flexbox.center]}>
          <Spinner />
        </View>
      )}
    </TransferControllerStateContext.Provider>
  )
}

export { TransferControllerStateProvider, TransferControllerStateContext }
