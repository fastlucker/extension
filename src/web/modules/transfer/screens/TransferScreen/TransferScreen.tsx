import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useTransferControllerState from '@web/hooks/useTransferControllerState'

import AddressBookSection from '../../components/AddressBookSection'
import SendForm from '../../components/SendForm/SendForm'
import styles from './styles'

const TransferScreen = () => {
  const { dispatch } = useBackgroundService()
  const { state, initializeController } = useTransferControllerState()
  const { accountPortfolio } = usePortfolioControllerState()
  const { navigate } = useNavigation()

  useEffect(() => {
    initializeController()
  }, [initializeController])

  const handleReset = useCallback(
    () =>
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_RESET'
      }),
    [dispatch]
  )

  const onBack = useCallback(() => {
    handleReset()
    navigate(ROUTES.dashboard)
  }, [navigate, handleReset])

  useEffect(() => {
    window.addEventListener('beforeunload', handleReset)
    return () => {
      window.removeEventListener('beforeunload', handleReset)
      handleReset()
    }
  }, [handleReset])

  return (
    <TabLayoutWrapperMainContent width="lg" forceCanGoBack onBack={onBack}>
      <View style={styles.container}>
        {state?.isInitialized ? (
          <SendForm state={state} isAllReady={accountPortfolio?.isAllReady} />
        ) : null}
        <View style={styles.separator} />
        <AddressBookSection />
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default TransferScreen
