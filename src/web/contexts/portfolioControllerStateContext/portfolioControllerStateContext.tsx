import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import { NetworkId } from '@ambire-common/interfaces/network'
import { UserRequest } from '@ambire-common/interfaces/userRequest'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import {
  CollectionResult as CollectionResultInterface,
  TokenResult as TokenResultInterface,
  SimulationNonces as SimulationNoncesInterface,
  TokenAmount as TokenAmountInterface
} from '@ambire-common/libs/portfolio/interfaces'
import { calculateAccountPortfolio } from '@ambire-common/libs/portfolio/portfolioView'
import {
  buildClaimWalletRequest,
  buildMintVestingRequest
} from '@ambire-common/libs/transfer/userRequest'
import useConnectivity from '@common/hooks/useConnectivity'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

export interface AccountPortfolio {
  tokens: TokenResultInterface[]
  collections: CollectionResultInterface[]
  totalAmount: number
  isAllReady: boolean
  simulationNonces: SimulationNoncesInterface
  tokenAmounts: TokenAmountInterface[]
}

const DEFAULT_ACCOUNT_PORTFOLIO = {
  tokens: [],
  collections: [],
  totalAmount: 0,
  isAllReady: false,
  simulationNonces: {},
  tokenAmounts: []
}

const PortfolioControllerStateContext = createContext<{
  accountPortfolio: AccountPortfolio | null
  state: PortfolioController
  startedLoadingAtTimestamp: null | number
  getTemporaryTokens: (networkId: NetworkId, tokenId: CustomToken['address']) => void
  updateTokenPreferences: (token: CustomToken) => void
  removeTokenPreferences: (token: CustomToken) => void
  checkToken: ({ address, networkId }: { address: String; networkId: NetworkId }) => void
  claimWalletRewards: (token: TokenResultInterface) => void
  claimEarlySupportersVesting: (token: TokenResultInterface) => void
  resetAccountPortfolioLocalState: () => void
}>({
  accountPortfolio: DEFAULT_ACCOUNT_PORTFOLIO,
  state: {} as any,
  startedLoadingAtTimestamp: null,
  getTemporaryTokens: () => {},
  updateTokenPreferences: () => {},
  removeTokenPreferences: () => {},
  checkToken: () => {},
  claimWalletRewards: () => {},
  claimEarlySupportersVesting: () => {},
  resetAccountPortfolioLocalState: () => {}
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'portfolio'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const { isOffline } = useConnectivity()
  const accountsState = useAccountsControllerState()
  const account = accountsState.accounts?.find((acc) => acc.addr === accountsState.selectedAccount)
  const actionState = useActionsControllerState()

  const hasSignAccountOp = useMemo(
    () => !!actionState?.visibleActionsQueue?.filter((action) => action.type === 'accountOp'),
    [actionState?.visibleActionsQueue]
  )

  const [accountPortfolio, setAccountPortfolio] =
    useState<AccountPortfolio>(DEFAULT_ACCOUNT_PORTFOLIO)
  const [startedLoadingAtTimestamp, setStartedLoadingAtTimestamp] = useState<number | null>(null)
  const prevAccountPortfolio = useRef<AccountPortfolio>(DEFAULT_ACCOUNT_PORTFOLIO)

  const resetAccountPortfolioLocalState = useCallback(() => {
    setAccountPortfolio(DEFAULT_ACCOUNT_PORTFOLIO)
    prevAccountPortfolio.current = DEFAULT_ACCOUNT_PORTFOLIO
    setStartedLoadingAtTimestamp(null)
  }, [])

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller }
      })
    }
  }, [dispatch, state])

  useEffect(() => {
    // Set an initial empty state for accountPortfolio
    resetAccountPortfolioLocalState()
  }, [accountsState.selectedAccount, resetAccountPortfolioLocalState])

  useEffect(() => {
    if (!accountsState.selectedAccount || !account) return

    const newAccountPortfolio = calculateAccountPortfolio(
      accountsState.selectedAccount,
      state,
      prevAccountPortfolio?.current,
      hasSignAccountOp
    )

    if (
      newAccountPortfolio.isAllReady ||
      (!prevAccountPortfolio?.current?.tokens?.length && newAccountPortfolio.tokens.length)
    ) {
      setAccountPortfolio(newAccountPortfolio)

      if (newAccountPortfolio.isAllReady) prevAccountPortfolio.current = newAccountPortfolio
    }
  }, [accountsState.selectedAccount, account, state, hasSignAccountOp])

  useEffect(() => {
    if (startedLoadingAtTimestamp && accountPortfolio.isAllReady) {
      setStartedLoadingAtTimestamp(null)
      return
    }

    if (!startedLoadingAtTimestamp && !accountPortfolio.isAllReady) {
      setStartedLoadingAtTimestamp(Date.now())
    }
  }, [startedLoadingAtTimestamp, accountPortfolio.isAllReady])

  useEffect(() => {
    if (!account || !state.latest || !state.latest[account.addr]) return

    if (
      !isOffline &&
      state.latest[account.addr].ethereum?.criticalError &&
      state.latest[account.addr].polygon?.criticalError &&
      state.latest[account.addr].optimism?.criticalError &&
      accountPortfolio.isAllReady &&
      accountsState?.statuses?.updateAccountState === 'INITIAL'
    ) {
      dispatch({
        type: 'MAIN_CONTROLLER_RELOAD_SELECTED_ACCOUNT'
      })
    }
  }, [
    account,
    accountPortfolio.isAllReady,
    accountsState?.statuses?.updateAccountState,
    dispatch,
    isOffline,
    state.latest
  ])

  const getTemporaryTokens = useCallback(
    (networkId: NetworkId, tokenId: string) => {
      dispatch({
        type: 'PORTFOLIO_CONTROLLER_GET_TEMPORARY_TOKENS',
        params: {
          networkId,
          additionalHint: tokenId
        }
      })
    },
    [dispatch]
  )

  const updateTokenPreferences = useCallback(
    async (token: CustomToken) => {
      dispatch({
        type: 'PORTFOLIO_CONTROLLER_UPDATE_TOKEN_PREFERENCES',
        params: {
          token
        }
      })
    },
    [dispatch]
  )

  const removeTokenPreferences = useCallback(
    (token: CustomToken) => {
      dispatch({
        type: 'PORTFOLIO_CONTROLLER_REMOVE_TOKEN_PREFERENCES',
        params: {
          token
        }
      })
    },
    [dispatch]
  )

  const checkToken = useCallback(
    (token: { networkId: NetworkId; address: string }) => {
      dispatch({
        type: 'PORTFOLIO_CONTROLLER_CHECK_TOKEN',
        params: {
          token
        }
      })
    },
    [dispatch]
  )

  const claimWalletRewards = useCallback(
    (token: TokenResultInterface) => {
      if (!accountsState.selectedAccount || !account) return

      const claimableRewardsData =
        state.latest[accountsState.selectedAccount].rewards?.result?.claimableRewardsData

      if (!claimableRewardsData) return
      const userRequest: UserRequest = buildClaimWalletRequest({
        selectedAccount: accountsState.selectedAccount,
        selectedToken: token,
        claimableRewardsData
      })
      dispatch({
        type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
        params: userRequest
      })
    },
    [dispatch, account, accountsState.selectedAccount, state.latest]
  )

  const claimEarlySupportersVesting = useCallback(
    (token: TokenResultInterface) => {
      if (!accountsState.selectedAccount || !account) return

      const addrVestingData =
        state.latest[accountsState.selectedAccount].rewards?.result?.addrVestingData

      if (!addrVestingData) return
      const userRequest: UserRequest = buildMintVestingRequest({
        selectedAccount: accountsState.selectedAccount,
        selectedToken: token,
        addrVestingData
      })
      dispatch({
        type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
        params: userRequest
      })
    },
    [dispatch, account, accountsState.selectedAccount, state.latest]
  )

  return (
    <PortfolioControllerStateContext.Provider
      value={useMemo(
        () => ({
          state,
          accountPortfolio,
          startedLoadingAtTimestamp,
          updateTokenPreferences,
          removeTokenPreferences,
          checkToken,
          getTemporaryTokens,
          claimWalletRewards,
          claimEarlySupportersVesting,
          resetAccountPortfolioLocalState
        }),
        [
          state,
          accountPortfolio,
          startedLoadingAtTimestamp,
          updateTokenPreferences,
          removeTokenPreferences,
          checkToken,
          getTemporaryTokens,
          claimWalletRewards,
          claimEarlySupportersVesting,
          resetAccountPortfolioLocalState
        ]
      )}
    >
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
