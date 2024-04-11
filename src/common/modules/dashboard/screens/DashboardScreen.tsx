import React, { useCallback, useRef } from 'react'
import { Animated, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { isWeb } from '@common/config/env'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING, SPACING_TY, SPACING_XL } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import ReceiveModal from '@web/components/ReceiveModal'
import { DURATIONS } from '@web/hooks/useHover'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { getUiType } from '@web/utils/uiType'

import DAppFooter from '../components/DAppFooter'
import DashboardOverview from '../components/DashboardOverview'
import DashboardSectionList from '../components/DashboardSectionList'
import getStyles from './styles'

const { isPopup, isTab } = getUiType()

const DEFAULT_MAX_HEIGHT = 120

const DashboardScreen = () => {
  const route = useRoute()
  const { styles } = useTheme(getStyles)
  const { minWidthSize } = useWindowSize()

  const { accountPortfolio, state } = usePortfolioControllerState()
  const { ref: receiveModalRef, open: openReceiveModal, close: closeReceiveModal } = useModalize()

  const maxHeight = useRef(new Animated.Value(DEFAULT_MAX_HEIGHT)).current
  const paddingTop = useRef(new Animated.Value(SPACING_XL)).current
  const paddingBottom = useRef(new Animated.Value(SPACING)).current

  const filterByNetworkId = route?.state?.filterByNetworkId || null

  const onScroll = useCallback(
    (value: number) => {
      if (!isPopup) return

      const isOverviewShown = value < 60

      Animated.parallel([
        Animated.timing(maxHeight, {
          toValue: isOverviewShown ? DEFAULT_MAX_HEIGHT : 0,
          duration: DURATIONS.FAST,
          useNativeDriver: !isWeb
        }),
        Animated.timing(paddingTop, {
          toValue: isOverviewShown ? SPACING_XL : 0,
          duration: isOverviewShown ? 100 : DURATIONS.REGULAR, // Different on purpose
          useNativeDriver: !isWeb
        }),
        Animated.timing(paddingBottom, {
          toValue: isOverviewShown ? SPACING : SPACING_TY,
          duration: DURATIONS.FAST,
          useNativeDriver: !isWeb
        })
      ]).start()
    },
    [maxHeight, paddingBottom, paddingTop]
  )

  return (
    <>
      <ReceiveModal modalRef={receiveModalRef} handleClose={closeReceiveModal} />
      <View style={styles.container}>
        <View style={[flexbox.flex1, isTab && minWidthSize('l') && spacings.phSm]}>
          <DashboardOverview
            openReceiveModal={openReceiveModal}
            maxHeight={maxHeight}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
          />
          <DashboardSectionList
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
