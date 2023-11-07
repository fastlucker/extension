import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
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
  const { t } = useTranslation()
  const { theme } = useTheme()

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

  const sendTransaction = useCallback(async () => {
    await dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_BUILD_USER_REQUEST'
    })
  }, [dispatch])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<Header withAmbireLogo withBackButton={false} mode="custom-inner-content" />}
      footer={
        <View
          style={[
            flexbox.flex1,
            flexbox.justifySpaceBetween,
            flexbox.alignCenter,
            flexbox.directionRow
          ]}
        >
          <TouchableOpacity
            style={[flexbox.directionRow, flexbox.alignCenter, spacings.mr2Xl]}
            onPress={onBack}
          >
            <LeftArrowIcon />
            <Text style={spacings.plTy} fontSize={16} weight="medium" appearance="secondaryText">
              {t('Back')}
            </Text>
          </TouchableOpacity>
          <Button
            type="primary"
            text={t('Send')}
            onPress={sendTransaction}
            hasBottomSpacing={false}
            disabled={!state.isFormValid}
          >
            <View style={spacings.plTy}>
              <SendIcon width={20} color={colors.titan} />
            </View>
          </Button>
        </View>
      }
    >
      <TabLayoutWrapperMainContent>
        {state?.isInitialized ? (
          <Panel>
            <View style={styles.container}>
              <View style={flexbox.flex1}>
                <SendForm state={state} isAllReady={accountPortfolio?.isAllReady} />
              </View>
              <View style={styles.separator} />
              <View style={flexbox.flex1}>
                <AddressBookSection />
              </View>
            </View>
          </Panel>
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
