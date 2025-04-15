import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { EstimationStatus } from '@ambire-common/controllers/estimation/types'
import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import { getTabLayoutPadding } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import SwapAndBridgeEstimation from '@web/modules/swap-and-bridge/components/Estimation'
import RoutesModal from '@web/modules/swap-and-bridge/components/RoutesModal'
import useSwapAndBridgeForm from '@web/modules/swap-and-bridge/hooks/useSwapAndBridgeForm'
import { getUiType } from '@web/utils/uiType'

import BatchModal from '../../components/BatchModal'
import Buttons from '../../components/Buttons'
import FromToken from '../../components/FromToken'
import PriceImpactWarningModal from '../../components/PriceImpactWarningModal'
import RouteInfo from '../../components/RouteInfo'
import ToToken from '../../components/ToToken'
import getStyles from './styles'

const { isTab, isActionWindow } = getUiType()

const SwapAndBridgeScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { maxWidthSize } = useWindowSize()
  const {
    sessionId,
    fromAmountValue,
    onFromAmountChange,
    fromTokenOptions,
    fromTokenValue,
    fromTokenAmountSelectDisabled,
    handleSubmitForm,
    shouldConfirmFollowUpTransactions,
    followUpTransactionConfirmed,
    highPriceImpactInPercentage,
    priceImpactModalRef,
    closePriceImpactModal,
    acknowledgeHighPriceImpact,
    pendingRoutes,
    routesModalRef,
    openRoutesModal,
    closeRoutesModal,
    estimationModalRef,
    closeEstimationModalWrapped,
    isAutoSelectRouteDisabled,
    setIsAutoSelectRouteDisabled,
    isOneClickModeAllowed,
    batchModalRef,
    closeBatchModal,
    isBridge
  } = useSwapAndBridgeForm()
  const {
    sessionIds,
    formStatus,
    isHealthy,
    shouldEnableRoutesSelection,
    updateQuoteStatus,
    signAccountOpController
  } = useSwapAndBridgeControllerState()

  const { statuses: mainCtrlStatuses } = useMainControllerState()
  const prevPendingRoutes: any[] | undefined = usePrevious(pendingRoutes)
  const scrollViewRef: any = useRef(null)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    if (!signAccountOpController || isAutoSelectRouteDisabled) return
    if (signAccountOpController.estimation.status === EstimationStatus.Error) {
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_ON_ESTIMATION_FAILURE'
      })
    }
  })

  const handleBackButtonPress = useCallback(() => {
    navigate(ROUTES.dashboard)
  }, [navigate])

  useEffect(() => {
    if (!pendingRoutes || !prevPendingRoutes) return
    if (!pendingRoutes.length) return
    if (prevPendingRoutes.length < pendingRoutes.length) {
      // scroll to top when there is a new item in the active routes list
      scrollViewRef.current?.scrollTo({ y: 0 })
    }
  }, [pendingRoutes, prevPendingRoutes])

  // TODO: Disable tokens that are NOT supported
  // (not in the `fromTokenList` of the SwapAndBridge controller)

  // TODO: Confirmation modal (warn) if the diff in dollar amount between the
  // FROM and TO tokens is too high (therefore, user will lose money).

  const paddingHorizontalStyle = useMemo(() => getTabLayoutPadding(maxWidthSize), [maxWidthSize])

  const isEstimatingRoute =
    formStatus === SwapAndBridgeFormStatus.ReadyToEstimate &&
    (!signAccountOpController ||
      signAccountOpController.estimation.status === EstimationStatus.Loading)

  const isNotReadyToProceed = useMemo(() => {
    return (
      formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit ||
      shouldConfirmFollowUpTransactions !== followUpTransactionConfirmed ||
      mainCtrlStatuses.buildSwapAndBridgeUserRequest !== 'INITIAL' ||
      updateQuoteStatus === 'LOADING' ||
      isEstimatingRoute
    )
  }, [
    followUpTransactionConfirmed,
    isEstimatingRoute,
    formStatus,
    mainCtrlStatuses.buildSwapAndBridgeUserRequest,
    shouldConfirmFollowUpTransactions,
    updateQuoteStatus
  ])

  if (!sessionIds.includes(sessionId)) return null

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <Header
          displayBackButtonIn="always"
          mode="title"
          customTitle={t('Swap & Bridge')}
          withAmbireLogo
          forceBack
          onGoBackPress={() => {
            dispatch({
              type: 'SWAP_AND_BRIDGE_CONTROLLER_UNLOAD_SCREEN',
              params: { sessionId, forceUnload: true }
            })
            if (isActionWindow) {
              dispatch({
                type: 'SWAP_AND_BRIDGE_CONTROLLER_CLOSE_SIGNING_ACTION_WINDOW'
              })
            } else {
              navigate(ROUTES.dashboard)
            }
          }}
        />
      }
      withHorizontalPadding={false}
      footer={
        isTab ? (
          <>
            <BackButton onPress={handleBackButtonPress} />
            <Buttons
              isOneClickModeAllowed={isOneClickModeAllowed}
              isNotReadyToProceed={isNotReadyToProceed}
              handleSubmitForm={handleSubmitForm}
              isBatchAllowed={!isBridge}
            />
          </>
        ) : null
      }
    >
      <TabLayoutWrapperMainContent
        contentContainerStyle={{
          ...spacings.pt0,
          ...spacings.pb0,
          ...paddingHorizontalStyle,
          flexGrow: 1
        }}
        wrapperRef={scrollViewRef}
      >
        <View style={styles.container}>
          {isHealthy === false && (
            <Alert
              type="error"
              title={t('Temporarily unavailable.')}
              text={t(
                "We're currently unable to initiate a swap or bridge request because our service provider's API is temporarily unavailable. Please try again later. If the issue persists, check for updates or contact support."
              )}
              style={spacings.mb}
            />
          )}

          <View style={styles.form}>
            <FromToken
              fromTokenOptions={fromTokenOptions}
              fromTokenValue={fromTokenValue}
              fromAmountValue={fromAmountValue}
              fromTokenAmountSelectDisabled={fromTokenAmountSelectDisabled}
              onFromAmountChange={onFromAmountChange}
              setIsAutoSelectRouteDisabled={setIsAutoSelectRouteDisabled}
            />
            <ToToken
              isAutoSelectRouteDisabled={isAutoSelectRouteDisabled}
              setIsAutoSelectRouteDisabled={setIsAutoSelectRouteDisabled}
            />
          </View>
          <RouteInfo
            isEstimatingRoute={isEstimatingRoute}
            openRoutesModal={openRoutesModal}
            shouldEnableRoutesSelection={shouldEnableRoutesSelection}
            isAutoSelectRouteDisabled={isAutoSelectRouteDisabled}
          />
          {!isTab && (
            <Buttons
              isOneClickModeAllowed={isOneClickModeAllowed}
              isNotReadyToProceed={isNotReadyToProceed}
              isBatchAllowed={!isBridge}
              handleSubmitForm={handleSubmitForm}
            />
          )}
        </View>
      </TabLayoutWrapperMainContent>
      <RoutesModal
        sheetRef={routesModalRef}
        closeBottomSheet={closeRoutesModal}
        setIsAutoSelectRouteDisabled={(disabled: boolean) => setIsAutoSelectRouteDisabled(disabled)}
      />
      <SwapAndBridgeEstimation
        closeEstimationModal={closeEstimationModalWrapped}
        estimationModalRef={estimationModalRef}
      />
      <PriceImpactWarningModal
        sheetRef={priceImpactModalRef}
        closeBottomSheet={closePriceImpactModal}
        acknowledgeHighPriceImpact={acknowledgeHighPriceImpact}
        highPriceImpactInPercentage={highPriceImpactInPercentage}
      />
      <BatchModal sheetRef={batchModalRef} closeBottomSheet={closeBatchModal} />
    </TabLayoutContainer>
  )
}

export default React.memo(SwapAndBridgeScreen)
