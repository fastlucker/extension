import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import useConstants from '@common/hooks/useConstants'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import { ROUTES } from '@common/modules/router/constants/common'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

import AddressBookSection from '../../components/AddressBookSection'
import SendForm from '../../components/SendForm/SendForm'
import styles from './styles'

const getInfoFromSearch = (search: string | undefined) => {
  if (!search || !search?.includes('networkId') || !search?.includes('address')) return null

  const params = new URLSearchParams(search)

  // Remove the search params from the url
  window.history.replaceState(null, '', `${window.location.pathname}#/transfer`)

  return `${params.get('address')}-${params.get('networkId')}`
}

const TransferScreen = () => {
  const { dispatch } = useBackgroundService()
  const { constants } = useConstants()
  const [state, setState] = useState<any>(null)
  const mainCtrl = useMainControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const { navigate } = useNavigation()
  const { search } = useRoute()
  const tokens = accountPortfolio?.tokens
  const selectedTokenFromUrl = useMemo(() => getInfoFromSearch(search), [search])

  const preSelectedToken = useMemo(() => {
    if (!selectedTokenFromUrl && tokens && tokens?.length > 0)
      return `${tokens[0].address}-${tokens[0].networkId}`
    if (!selectedTokenFromUrl && !tokens) return null

    return selectedTokenFromUrl
  }, [selectedTokenFromUrl, tokens])

  const onBack = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_RESET'
    })
    navigate(ROUTES.dashboard)
  }, [navigate, dispatch])

  const handleReset = useCallback(
    () =>
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_RESET'
      }),
    [dispatch]
  )

  useEffect(() => {
    if (
      !constants ||
      !mainCtrl.selectedAccount ||
      !tokens ||
      !mainCtrl.isReady ||
      state?.isInitialized
    )
      return

    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_INIT',
      params: {
        selectedAccount: mainCtrl.selectedAccount,
        tokens,
        humanizerInfo: constants.humanizerInfo,
        preSelectedToken: preSelectedToken || undefined
      }
    })

    window.addEventListener('beforeunload', handleReset)

    return () => {
      window.removeEventListener('beforeunload', handleReset)
    }
  }, [constants, dispatch, mainCtrl.isReady, mainCtrl.selectedAccount, preSelectedToken, tokens])

  useEffect(() => {
    const onUpdate = (newState: any) => {
      setState(newState)
    }

    eventBus.addEventListener('transfer', onUpdate)

    return () => eventBus.removeEventListener('transfer', onUpdate)
  }, [mainCtrl.selectedAccount])

  return (
    <TabLayoutWrapperMainContent width="lg" forceCanGoBack onBack={onBack}>
      <View style={styles.container}>
        {state ? <SendForm state={state} isAllReady={accountPortfolio?.isAllReady} /> : null}
        <View style={styles.separator} />
        <AddressBookSection />
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default TransferScreen
