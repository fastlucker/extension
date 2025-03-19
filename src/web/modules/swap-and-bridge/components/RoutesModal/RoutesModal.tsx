import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'

import {
  SocketAPIRoute,
  SwapAndBridgeRoute,
  SwapAndBridgeStep
} from '@ambire-common/interfaces/swapAndBridge'
import { getQuoteRouteSteps } from '@ambire-common/libs/swapAndBridge/swapAndBridge'
import BackButton from '@common/components/BackButton'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import ScrollableWrapper, { WRAPPER_TYPES } from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_LG } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import RouteStepsPreview from '@web/modules/swap-and-bridge/components/RouteStepsPreview'
import { SWAP_AND_BRIDGE_FORM_WIDTH } from '@web/modules/swap-and-bridge/screens/SwapAndBridgeScreen/styles'

import getStyles from './styles'

const FLAT_LIST_ITEM_HEIGHT = 138.5

const RoutesModal = ({
  sheetRef,
  closeBottomSheet
}: {
  sheetRef: React.RefObject<any>
  closeBottomSheet: (dest?: 'default' | 'alwaysOpen' | undefined) => void
}) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const { quote, shouldEnableRoutesSelection } = useSwapAndBridgeControllerState()
  const { dispatch } = useBackgroundService()
  const scrollRef: any = useRef(null)

  const [selectedRoute, setSelectedRoute] = useState<SocketAPIRoute | null>(
    quote?.selectedRoute || null
  )
  const prevQuoteSelectedRoute: SocketAPIRoute | undefined = usePrevious(quote?.selectedRoute)
  const { height } = useWindowSize()

  useEffect(() => {
    if (
      prevQuoteSelectedRoute?.routeId !== quote?.selectedRoute?.routeId &&
      quote?.selectedRoute?.routeId !== selectedRoute?.routeId
    ) {
      setSelectedRoute(quote?.selectedRoute || null)
    }
  }, [prevQuoteSelectedRoute?.routeId, quote?.selectedRoute, selectedRoute?.routeId])

  const renderItem = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ item, index }: { item: SwapAndBridgeRoute; index: number }) => {
      // TODO: Migrate Socket to SwapAndBridgeStep
      // const steps = getQuoteRouteSteps(item.userTxs)
      const steps = item.steps

      return (
        <Pressable
          key={item.routeId}
          style={[
            styles.selectableItemContainer,
            index + 1 === quote?.routes?.length && spacings.mb0,
            item.routeId === selectedRoute?.routeId && styles.selectableItemSelected
          ]}
          onPress={() => setSelectedRoute(item)}
        >
          <RouteStepsPreview
            steps={steps}
            totalGasFeesInUsd={item.totalGasFeesInUsd}
            estimationInSeconds={item.serviceTime}
          />
        </Pressable>
      )
    },
    [quote?.routes?.length, selectedRoute?.routeId, styles]
  )

  const handleConfirmRouteSelection = useCallback(() => {
    if (!selectedRoute) return

    if (selectedRoute.routeId === quote?.selectedRoute?.routeId) {
      closeBottomSheet()
      return
    }

    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_SELECT_ROUTE',
      params: { route: selectedRoute }
    })
    closeBottomSheet()
  }, [closeBottomSheet, dispatch, quote?.selectedRoute?.routeId, selectedRoute])

  const selectedRouteIndex = useMemo(() => {
    if (!quote?.routes || !quote.routes.length) return 0
    if (!selectedRoute) return 0
    const selectedRouteIdx = quote.routes.findIndex((r) => r.routeId === selectedRoute.routeId)

    if (selectedRouteIdx === -1) return 0

    return selectedRouteIdx
  }, [quote?.routes, selectedRoute])

  if (!quote?.routes || !quote.routes.length || !shouldEnableRoutesSelection) return null

  return (
    <BottomSheet
      id="select-routes-modal"
      sheetRef={sheetRef}
      closeBottomSheet={closeBottomSheet}
      backgroundColor="primaryBackground"
      style={{
        overflow: 'hidden',
        width: SWAP_AND_BRIDGE_FORM_WIDTH,
        minHeight: height * 0.7
      }}
      scrollViewProps={{
        contentContainerStyle: { flex: 1 },
        scrollEnabled: false
      }}
      onOpen={() => {
        setSelectedRoute(quote.selectedRoute)
        setTimeout(() => {
          scrollRef?.current?.scrollTo({
            x: 0,
            y: selectedRouteIndex * FLAT_LIST_ITEM_HEIGHT - SPACING_LG
          })
        }, 100)
      }}
      containerInnerWrapperStyles={flexbox.flex1}
    >
      <Text fontSize={20} weight="semiBold" numberOfLines={1} style={spacings.mbLg}>
        {t('Select route')}
      </Text>
      <ScrollableWrapper
        type={WRAPPER_TYPES.FLAT_LIST}
        data={quote.routes}
        keyExtractor={(r: SocketAPIRoute) => r.routeId.toString()}
        renderItem={renderItem}
        initialNumToRender={6}
        windowSize={6}
        maxToRenderPerBatch={6}
        removeClippedSubviews
      />
      <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, spacings.ptMd]}>
        <BackButton onPress={closeBottomSheet as any} />
        <Button
          text={t('Confirm')}
          size="large"
          onPress={handleConfirmRouteSelection}
          disabled={!selectedRoute}
          hasBottomSpacing={false}
        />
      </View>
    </BottomSheet>
  )
}

export default React.memo(RoutesModal)
