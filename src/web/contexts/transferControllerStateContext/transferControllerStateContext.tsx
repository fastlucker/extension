import React, { createContext, useEffect, useMemo, useState } from 'react'

import humanizerInfo from '@ambire-common/consts/humanizer/humanizerInfo.json'
import { TransferController } from '@ambire-common/controllers/transfer/transfer'
import { HumanizerMeta } from '@ambire-common/libs/humanizer/interfaces'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import Spinner from '@common/components/Spinner'
import useRoute from '@common/hooks/useRoute'
import useAddressBookControllerState from '@web/hooks/useAddressBookControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

type ContextReturn = {
  state: TransferController
  transferCtrl: TransferController
  tokens: TokenResult[]
}

const TransferControllerStateContext = createContext<ContextReturn>({} as ContextReturn)

export const getInfoFromSearch = (search: string | undefined) => {
  if (!search || !search?.includes('networkId') || !search?.includes('address')) return null

  const params = new URLSearchParams(search)

  return {
    addr: params.get('address'),
    networkId: params.get('networkId'),
    isTopUp: typeof params.get('isTopUp') === 'string'
  }
}

const TransferControllerStateProvider: React.FC<any> = ({ children }) => {
  const mainState = useMainControllerState()
  const { networks } = useSettingsControllerState()
  const { contacts } = useAddressBookControllerState()
  const { search } = useRoute()
  const [state, setState] = useState<TransferController>({} as TransferController)
  const { accountPortfolio } = usePortfolioControllerState()
  const selectedTokenFromUrl = useMemo(() => getInfoFromSearch(search), [search])

  const transferCtrl = useMemo(() => {
    return new TransferController()
  }, [])

  const tokens = useMemo(
    () =>
      accountPortfolio?.tokens.filter(
        (token) => Number(getTokenAmount(token)) > 0 && !token.flags.onGasTank
      ) || [],
    [accountPortfolio]
  )

  useEffect(() => {
    transferCtrl.onUpdate(() => {
      setState(transferCtrl.toJSON())
    })
  }, [transferCtrl])

  useEffect(() => {
    if (!mainState.selectedAccount) return

    transferCtrl.update({
      selectedAccount: mainState.selectedAccount
    })
  }, [mainState.selectedAccount, transferCtrl])

  useEffect(() => {
    transferCtrl.update({
      networks
    })
  }, [transferCtrl, networks])

  useEffect(() => {
    transferCtrl.update({
      contacts
    })
  }, [contacts, transferCtrl])

  useEffect(() => {
    transferCtrl.update({
      humanizerInfo: humanizerInfo as HumanizerMeta
    })
  }, [transferCtrl])

  useEffect(() => {
    const selectedTokenData = tokens.find(
      (token) =>
        token.address === selectedTokenFromUrl?.addr &&
        token.networkId === selectedTokenFromUrl?.networkId
    )

    transferCtrl.update({
      selectedToken: selectedTokenData
    })
  }, [selectedTokenFromUrl?.addr, selectedTokenFromUrl?.networkId, tokens, transferCtrl])

  useEffect(() => {
    transferCtrl.update({
      isTopUp: !!selectedTokenFromUrl?.isTopUp
    })
  }, [selectedTokenFromUrl?.isTopUp, transferCtrl])

  // If the user sends the max amount of a token it will disappear from the list of tokens
  // and we need to select another token
  useEffect(() => {
    if (!state.selectedToken?.address) return

    const isSelectedTokenInTokens = tokens.find(
      (token) =>
        token.address === state.selectedToken?.address &&
        token.networkId === state.selectedToken?.networkId &&
        token.flags.rewardsType === state.selectedToken?.flags.rewardsType
    )

    if (isSelectedTokenInTokens) return

    transferCtrl.update({
      selectedToken: tokens[0]
    })
  }, [
    state.selectedToken?.address,
    state.selectedToken?.flags.rewardsType,
    state.selectedToken?.networkId,
    tokens,
    transferCtrl
  ])

  return (
    <TransferControllerStateContext.Provider
      value={useMemo(() => ({ state, transferCtrl, tokens }), [state, transferCtrl, tokens])}
    >
      {Object.keys(state).length ? children : <Spinner />}
    </TransferControllerStateContext.Provider>
  )
}

export { TransferControllerStateProvider, TransferControllerStateContext }
