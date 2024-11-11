import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import { NetworkId } from '@ambire-common/interfaces/network'
import { UserRequest } from '@ambire-common/interfaces/userRequest'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { TokenResult as TokenResultInterface } from '@ambire-common/libs/portfolio/interfaces'
import {
  buildClaimWalletRequest,
  buildMintVestingRequest
} from '@ambire-common/libs/transfer/userRequest'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

const PortfolioControllerStateContext = createContext<{
  state: PortfolioController
  startedLoadingAtTimestamp: null | number
  getTemporaryTokens: (networkId: NetworkId, tokenId: CustomToken['address']) => void
  updateTokenPreferences: (token: CustomToken) => void
  removeTokenPreferences: (token: CustomToken) => void
  checkToken: ({ address, networkId }: { address: String; networkId: NetworkId }) => void
  claimWalletRewards: (token: TokenResultInterface) => void
  claimEarlySupportersVesting: (token: TokenResultInterface) => void
}>({
  state: {} as any,
  startedLoadingAtTimestamp: null,
  getTemporaryTokens: () => {},
  updateTokenPreferences: () => {},
  removeTokenPreferences: () => {},
  checkToken: () => {},
  claimWalletRewards: () => {},
  claimEarlySupportersVesting: () => {}
})

const PortfolioControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'portfolio'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  // const { isOffline } = useConnectivity()
  const { account } = useSelectedAccountControllerState()

  const [startedLoadingAtTimestamp, setStartedLoadingAtTimestamp] = useState<number | null>(null)

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller }
      })
    }
  }, [dispatch, state])

  // TODO:
  // useEffect(() => {
  //   if (startedLoadingAtTimestamp && accountPortfolio.isAllReady) {
  //     setStartedLoadingAtTimestamp(null)
  //     return
  //   }

  //   if (!startedLoadingAtTimestamp && !accountPortfolio.isAllReady) {
  //     setStartedLoadingAtTimestamp(Date.now())
  //   }
  // }, [startedLoadingAtTimestamp, accountPortfolio.isAllReady])

  // TODO:
  // useEffect(() => {
  //   if (!account || !state.latest || !state.latest[account.addr]) return

  //   if (
  //     !isOffline &&
  //     state.latest[account.addr].ethereum?.criticalError &&
  //     state.latest[account.addr].polygon?.criticalError &&
  //     state.latest[account.addr].optimism?.criticalError &&
  //     accountPortfolio.isAllReady &&
  //     accountsState?.statuses?.updateAccountState === 'INITIAL'
  //   ) {
  //     dispatch({
  //       type: 'MAIN_CONTROLLER_RELOAD_SELECTED_ACCOUNT'
  //     })
  //   }
  // }, [
  //   account,
  //   accountPortfolio.isAllReady,
  //   accountsState?.statuses?.updateAccountState,
  //   dispatch,
  //   isOffline,
  //   state.latest
  // ])

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
      if (!account) return

      const claimableRewardsData = state.latest[account.addr].rewards?.result?.claimableRewardsData

      if (!claimableRewardsData) return
      const userRequest: UserRequest = buildClaimWalletRequest({
        selectedAccount: account.addr,
        selectedToken: token,
        claimableRewardsData
      })
      dispatch({
        type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
        params: userRequest
      })
    },
    [dispatch, account, state.latest]
  )

  const claimEarlySupportersVesting = useCallback(
    (token: TokenResultInterface) => {
      if (!account) return

      const addrVestingData = state.latest[account.addr].rewards?.result?.addrVestingData

      if (!addrVestingData) return
      const userRequest: UserRequest = buildMintVestingRequest({
        selectedAccount: account.addr,
        selectedToken: token,
        addrVestingData
      })
      dispatch({
        type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
        params: userRequest
      })
    },
    [dispatch, account, state.latest]
  )

  return (
    <PortfolioControllerStateContext.Provider
      value={useMemo(
        () => ({
          state,
          startedLoadingAtTimestamp,
          updateTokenPreferences,
          removeTokenPreferences,
          checkToken,
          getTemporaryTokens,
          claimWalletRewards,
          claimEarlySupportersVesting
        }),
        [
          state,
          startedLoadingAtTimestamp,
          updateTokenPreferences,
          removeTokenPreferences,
          checkToken,
          getTemporaryTokens,
          claimWalletRewards,
          claimEarlySupportersVesting
        ]
      )}
    >
      {children}
    </PortfolioControllerStateContext.Provider>
  )
}

export { PortfolioControllerStateProvider, PortfolioControllerStateContext }
