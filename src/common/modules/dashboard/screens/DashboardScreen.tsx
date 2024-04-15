import React, { useCallback, useRef } from 'react'
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isWeb } from '@common/config/env'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import ReceiveModal from '@web/components/ReceiveModal'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { getUiType } from '@web/utils/uiType'

import DAppFooter from '../components/DAppFooter'
import DashboardOverview from '../components/DashboardOverview'
import DashboardPages from '../components/DashboardPages'
import getStyles from './styles'

const { isPopup, isTab } = getUiType()

export const OVERVIEW_MAX_HEIGHT = 120

const DashboardScreen = () => {
  const route = useRoute()
  const { styles } = useTheme(getStyles)
  const { minWidthSize } = useWindowSize()

  const { accountPortfolio, state } = usePortfolioControllerState()
  const { ref: receiveModalRef, open: openReceiveModal, close: closeReceiveModal } = useModalize()

  const animatedOverviewHeight = useRef(new Animated.Value(OVERVIEW_MAX_HEIGHT)).current

  const filterByNetworkId = route?.state?.filterByNetworkId || null

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isPopup) return

      const {
        contentOffset: { y }
      } = event.nativeEvent

      const isOverviewShown = y < 50

      Animated.spring(animatedOverviewHeight, {
        toValue: isOverviewShown ? OVERVIEW_MAX_HEIGHT : 0,
        bounciness: 0,
        speed: 2.8,
        overshootClamping: true,
        useNativeDriver: !isWeb
      }).start()
    },
    [animatedOverviewHeight]
  )

  return (
    <>
      <ReceiveModal modalRef={receiveModalRef} handleClose={closeReceiveModal} />
      <View style={styles.container}>
        <View style={[flexbox.flex1, isTab && minWidthSize('l') && spacings.phSm]}>
          <DashboardOverview
            openReceiveModal={openReceiveModal}
            animatedOverviewHeight={animatedOverviewHeight}
          />
          <DashboardPages
            accountPortfolio={accountPortfolio}
            tokenPreferences={state?.tokenPreferences}
            filterByNetworkId={filterByNetworkId}
            onScroll={onScroll}
          />
        </View>
        {!!isPopup && <DAppFooter />}
      </View>
    </>
  )
}

export default React.memo(DashboardScreen)
