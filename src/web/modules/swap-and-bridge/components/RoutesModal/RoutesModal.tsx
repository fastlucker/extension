import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'

import { SwapAndBridgeRoute } from '@ambire-common/interfaces/swapAndBridge'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import BottomSheet from '@common/components/BottomSheet'
import ScrollableWrapper, { WRAPPER_TYPES } from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_LG } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import RouteStepsPreview from '@web/modules/swap-and-bridge/components/RouteStepsPreview'
import { SWAP_AND_BRIDGE_FORM_WIDTH } from '@web/modules/swap-and-bridge/screens/SwapAndBridgeScreen/styles'
import { getUiType } from '@web/utils/uiType'

import { EstimationStatus } from '@ambire-common/controllers/estimation/types'
import getStyles from './styles'

const FLAT_LIST_ITEM_HEIGHT = 138.5

const { isPopup } = getUiType()

const RoutesModal = ({
  sheetRef,
  closeBottomSheet
}: {
  sheetRef: React.RefObject<any>
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const { quote, shouldEnableRoutesSelection, signAccountOpController } =
    useSwapAndBridgeControllerState()
  const { dispatch } = useBackgroundService()
  const scrollRef: any = useRef(null)
  const { height } = useWindowSize()
  // there's a small discrepancy between ticks and we want to capture that
  const [userSelectedRoute, setUserSelectedRoute] = useState<SwapAndBridgeRoute | undefined>(
    undefined
  )
  const [isEstimationLoading, setIsEstimationLoading] = useState<boolean>(false)
  const [disabledRoutes, setDisabledRoutes] = useState<string[]>([])

  const persistedSelectedRoute = useMemo(() => {
    return quote?.selectedRoute
  }, [quote?.selectedRoute])

  useEffect(() => {
    setUserSelectedRoute(persistedSelectedRoute)
  }, [persistedSelectedRoute])

  const handleSelectRoute = useCallback(
    (route: SwapAndBridgeRoute) => {
      if (!route) return
      if (disabledRoutes.indexOf(route.routeId) !== -1) return

      if (route.routeId === persistedSelectedRoute?.routeId) {
        closeBottomSheet()
        return
      }

      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_SELECT_ROUTE',
        params: { route }
      })
      setUserSelectedRoute(route)
      setIsEstimationLoading(true)
    },
    [closeBottomSheet, dispatch, persistedSelectedRoute, disabledRoutes]
  )

  useEffect(() => {
    if (!signAccountOpController) return
    if (!isEstimationLoading) return
    if (!userSelectedRoute || !persistedSelectedRoute) return

    if (
      userSelectedRoute.routeId === persistedSelectedRoute.routeId &&
      signAccountOpController.estimation.status === EstimationStatus.Error
    ) {
      setIsEstimationLoading(false)
      disabledRoutes.push(persistedSelectedRoute.routeId)
      setDisabledRoutes(disabledRoutes)
    }

    if (
      userSelectedRoute.routeId === persistedSelectedRoute.routeId &&
      signAccountOpController.estimation.status === EstimationStatus.Success
    ) {
      setIsEstimationLoading(false)
      closeBottomSheet()
    }
  }, [
    userSelectedRoute,
    signAccountOpController,
    closeBottomSheet,
    persistedSelectedRoute,
    isEstimationLoading,
    disabledRoutes
  ])

  const renderItem = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ item, index }: { item: SwapAndBridgeRoute; index: number }) => {
      const { steps } = item
      const isDisabled = disabledRoutes.indexOf(item.routeId) !== -1

      return (
        <Pressable
          key={item.routeId}
          style={[
            styles.selectableItemContainer,
            index + 1 === quote?.routes?.length && spacings.mb0,
            item.routeId === userSelectedRoute?.routeId &&
              !isDisabled &&
              styles.selectableItemSelected,
            isDisabled && styles.disabledItem
          ]}
          onPress={() => handleSelectRoute(item)}
        >
          <RouteStepsPreview
            steps={steps}
            totalGasFeesInUsd={item.totalGasFeesInUsd}
            estimationInSeconds={item.serviceTime}
            isEstimationLoading={isEstimationLoading}
            isSelected={item.routeId === userSelectedRoute?.routeId}
            isDisabled={isDisabled}
          />
        </Pressable>
      )
    },
    [
      handleSelectRoute,
      quote?.routes?.length,
      userSelectedRoute?.routeId,
      styles.selectableItemContainer,
      styles.selectableItemSelected,
      styles.disabledItem,
      isEstimationLoading,
      disabledRoutes
    ]
  )

  const selectedRouteIndex = useMemo(() => {
    if (!quote?.routes || !quote.routes.length) return 0
    if (!userSelectedRoute) return 0
    const selectedRouteIdx = quote.routes.findIndex((r) => r.routeId === userSelectedRoute.routeId)

    if (selectedRouteIdx === -1) return 0

    return selectedRouteIdx
  }, [quote?.routes, userSelectedRoute])

  if (!quote?.routes || !quote.routes.length || !shouldEnableRoutesSelection) return null

  return (
    <BottomSheet
      id="select-routes-modal"
      sheetRef={sheetRef}
      closeBottomSheet={closeBottomSheet}
      backgroundColor="secondaryBackground"
      style={{
        overflow: 'hidden',
        width: !isPopup ? SWAP_AND_BRIDGE_FORM_WIDTH : '100%',
        minHeight: height * 0.7
      }}
      scrollViewProps={{
        contentContainerStyle: { flex: 1 },
        scrollEnabled: false
      }}
      onOpen={() => {
        if (!selectedRouteIndex) return

        // @TODO: Fix this
        setTimeout(() => {
          scrollRef?.current?.scrollTo({
            x: 0,
            y: selectedRouteIndex * FLAT_LIST_ITEM_HEIGHT - SPACING_LG
          })
        }, 100)
      }}
      containerInnerWrapperStyles={flexbox.flex1}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbXl]}>
        <Pressable
          onPress={() => closeBottomSheet()}
          style={{
            width: 28,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <LeftArrowIcon width={16} height={16} />
        </Pressable>
        <Text fontSize={20} weight="semiBold" numberOfLines={1} style={spacings.mlTy}>
          {t('Select route')}
        </Text>
      </View>
      <ScrollableWrapper
        type={WRAPPER_TYPES.FLAT_LIST}
        data={quote.routes}
        wrapperRef={scrollRef}
        keyExtractor={(r: SwapAndBridgeRoute) => r.routeId.toString()}
        renderItem={renderItem}
        initialNumToRender={6}
        windowSize={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews
      />
    </BottomSheet>
  )
}

export default React.memo(RoutesModal)
