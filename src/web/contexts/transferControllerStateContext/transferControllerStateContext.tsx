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
    if (!memoizedState.isInitialized || !memoizedState.selectedToken?.address) return

    // If a token is already selected, we should retrieve its latest value from tokens.
    // This is important because the token amount is likely to change,
    // especially when initiating a transfer or adding a new one to the queue.
    // As a result, the token `amountPostSimulation` may differ, and we need to update the available token balance accordingly.
    const selectedToken = tokens.find(
      (token) =>
        token.address === memoizedState.selectedToken?.address &&
        token.chainId === memoizedState.selectedToken?.chainId
    )

    dispatch({
      type: 'TRANSFER_CONTROLLER_UPDATE_FORM',
      params: { formValues: { selectedToken } }
    })
  }, [
    tokens,
    memoizedState?.isInitialized,
    memoizedState?.selectedToken?.address,
    dispatch
  ])

  // If the user sends the max amount of a token it will disappear from the list of tokens
  // and we need to select another token
  useEffect(() => {
    if (
      !memoizedState.isInitialized ||
      !memoizedState.selectedToken?.address ||
      !memoizedState ||
      !portfolio?.latest ||
      !portfolio?.pending
    )
      return
    const isSelectedTokenNetworkLoading =
      portfolio.pending[memoizedState.selectedToken.chainId.toString()]?.isLoading ||
      portfolio.latest[memoizedState.selectedToken.chainId.toString()]?.isLoading

    if (isSelectedTokenNetworkLoading) return

    const isSelectedTokenInTokens = tokens.find(
      (token) =>
        token.address === memoizedState.selectedToken?.address &&
        token.chainId === memoizedState.selectedToken?.chainId &&
        token.flags.rewardsType === memoizedState.selectedToken?.flags.rewardsType
    )

    if (isSelectedTokenInTokens) return

    dispatch({
      type: 'TRANSFER_CONTROLLER_UPDATE_FORM',
      params: { formValues: { selectedToken: tokens[0] } }
    })
  }, [
    portfolio?.latest,
    portfolio?.pending,
    memoizedState?.isInitialized,
    memoizedState.selectedToken?.address,
    memoizedState.selectedToken?.flags.rewardsType,
    memoizedState.selectedToken?.chainId,
    tokens,
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
