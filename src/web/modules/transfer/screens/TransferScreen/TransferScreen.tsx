import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import Spinner from '@common/components/Spinner'
import useNavigation from '@common/hooks/useNavigation'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
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
    <TabLayoutContainer
      width="lg"
      header={<Header withAmbireLogo forceBack onGoBackPress={onBack} />}
    >
      <TabLayoutWrapperMainContent>
        {state?.isInitialized ? (
          <View style={styles.container}>
            <SendForm state={state} isAllReady={accountPortfolio?.isAllReady} />
            <View style={styles.separator} />
            <AddressBookSection />
          </View>
        ) : (
          <View style={styles.spinnerContainer}>
            <Spinner />
          </View>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default TransferScreen
