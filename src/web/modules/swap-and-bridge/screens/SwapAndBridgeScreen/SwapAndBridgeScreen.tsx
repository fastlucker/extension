import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { EstimationStatus } from '@ambire-common/controllers/estimation/types'
import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatTime from '@common/utils/formatTime'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import { getTabLayoutPadding } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import SwapAndBridgeEstimation from '@web/modules/swap-and-bridge/components/Estimation'
import RoutesModal from '@web/modules/swap-and-bridge/components/RoutesModal'
import useSwapAndBridgeForm from '@web/modules/swap-and-bridge/hooks/useSwapAndBridgeForm'
import { getUiType } from '@web/utils/uiType'

import Buttons from '../../components/Buttons'
import FromToken from '../../components/FromToken'
import PriceImpactWarningModal from '../../components/PriceImpactWarningModal'
import ToToken from '../../components/ToToken'
import getStyles from './styles'

const { isPopup } = getUiType()

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
    closeEstimationModal,
    isAutoSelectRouteDisabled,
    setIsAutoSelectRouteDisabled,
    isOneClickModeAllowed
  } = useSwapAndBridgeForm()
  const {
    sessionIds,
    quote,
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
      (formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit &&
        formStatus !== SwapAndBridgeFormStatus.ReadyToEstimate) ||
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
          displayBackButtonIn="popup"
          mode="title"
          customTitle={t('Swap & Bridge')}
          withAmbireLogo
          forceBack
          onGoBackPress={() => {
            dispatch({
              type: 'SWAP_AND_BRIDGE_CONTROLLER_UNLOAD_SCREEN',
              params: { sessionId, forceUnload: true }
            })
            navigate(ROUTES.dashboard)
          }}
        />
      }
      withHorizontalPadding={false}
      footer={
        !isPopup ? (
          <>
            <BackButton onPress={handleBackButtonPress} />
            <Buttons
              isOneClickModeAllowed={isOneClickModeAllowed}
              isNotReadyToProceed={isNotReadyToProceed}
              handleSubmitForm={handleSubmitForm}
              isEstimatingRoute={isEstimatingRoute}
              formStatus={formStatus}
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
              isEstimatingRoute={isEstimatingRoute}
              setIsAutoSelectRouteDisabled={setIsAutoSelectRouteDisabled}
            />
          </View>
          <View
            style={[
              flexbox.directionRow,
              flexbox.alignCenter,
              flexbox.justifySpaceBetween,
              {
                height: 25 // Prevents layout shifts
              },
              spacings.mbLg
            ]}
          >
            {[
              SwapAndBridgeFormStatus.FetchingRoutes,
              SwapAndBridgeFormStatus.NoRoutesFound,
              SwapAndBridgeFormStatus.InvalidRouteSelected,
              SwapAndBridgeFormStatus.ReadyToEstimate,
              SwapAndBridgeFormStatus.ReadyToSubmit
            ].includes(formStatus) &&
              signAccountOpController?.estimation &&
              !isEstimatingRoute && (
                <>
                  {formStatus === SwapAndBridgeFormStatus.NoRoutesFound ? (
                    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                      <WarningIcon width={14} height={14} color={theme.warningDecorative} />
                      <Text
                        fontSize={14}
                        weight="medium"
                        appearance="warningText"
                        style={spacings.mlMi}
                      >
                        {t('No routes found!')}
                      </Text>
                    </View>
                  ) : (
                    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                      <Text appearance="tertiaryText" fontSize={14} weight="medium">
                        {t('Ambire fee: 0.025%')}
                      </Text>
                      {quote?.selectedRoute?.serviceTime ? (
                        <Text
                          appearance="tertiaryText"
                          fontSize={14}
                          weight="medium"
                          style={spacings.mlLg}
                        >
                          {t('Time: ~')} {formatTime(quote?.selectedRoute?.serviceTime)}
                        </Text>
                      ) : null}
                    </View>
                  )}

                  <Pressable
                    style={{
                      ...styles.selectAnotherRouteButton,
                      opacity: shouldEnableRoutesSelection ? 1 : 0.5
                    }}
                    onPress={openRoutesModal as any}
                    disabled={!shouldEnableRoutesSelection}
                  >
                    <Text
                      fontSize={14}
                      weight="medium"
                      appearance="primary"
                      style={{
                        ...spacings.mr,
                        textDecorationColor: theme.primary,
                        textDecorationLine: 'underline'
                      }}
                    >
                      {t('Select route')}
                    </Text>
                    <RightArrowIcon weight="2" width={5} height={16} color={theme.primary} />
                  </Pressable>
                </>
              )}
          </View>
          {isPopup && (
            <Buttons
              isOneClickModeAllowed={isOneClickModeAllowed}
              isNotReadyToProceed={isNotReadyToProceed}
              handleSubmitForm={handleSubmitForm}
              isEstimatingRoute={isEstimatingRoute}
              formStatus={formStatus}
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
        closeEstimationModal={closeEstimationModal}
        estimationModalRef={estimationModalRef}
      />
      <PriceImpactWarningModal
        sheetRef={priceImpactModalRef}
        closeBottomSheet={closePriceImpactModal}
        acknowledgeHighPriceImpact={acknowledgeHighPriceImpact}
        highPriceImpactInPercentage={highPriceImpactInPercentage}
      />
    </TabLayoutContainer>
  )
}

export default React.memo(SwapAndBridgeScreen)
