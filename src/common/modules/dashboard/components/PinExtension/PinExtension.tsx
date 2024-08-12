import React, { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import PinExtensionIcon from '@common/assets/svg/PinExtensionIcon'
import Backdrop from '@common/components/BottomSheet/Backdrop'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import ConfettiAnimation from '@common/modules/dashboard/components/ConfettiAnimation'
import { Portal } from '@gorhom/portal'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useWalletStateController from '@web/hooks/useWalletStateController'

import getStyles from './styles'

const PinExtension = () => {
  const { styles } = useTheme(getStyles)
  const { isPinned, isSetupComplete, isReady } = useWalletStateController()
  const { dispatch } = useBackgroundService()
  const { width, height } = useWindowSize()

  const onAnimationCompletion = useCallback(() => {
    dispatch({ type: 'SET_IS_SETUP_COMPLETE', params: { isSetupComplete: true } })
  }, [dispatch])

  const onReject = useCallback(() => {
    dispatch({ type: 'SET_IS_PINNED', params: { isPinned: false } })
    dispatch({ type: 'SET_IS_SETUP_COMPLETE', params: { isSetupComplete: true } })
  }, [dispatch])

  if (!isReady || isSetupComplete) return null

  return (
    <Portal hostName="global">
      {!isPinned ? (
        <>
          <View style={styles.pinExtensionIcon}>
            <TouchableOpacity style={styles.closeIcon} onPress={onReject}>
              <CloseIcon />
            </TouchableOpacity>
            <PinExtensionIcon />
          </View>

          <Backdrop isVisible isBottomSheetVisible onPress={onReject} />
        </>
      ) : (
        <ConfettiAnimation
          width={width > TAB_CONTENT_WIDTH ? TAB_CONTENT_WIDTH : width}
          height={height}
          autoPlay={false}
          onComplete={onAnimationCompletion}
        />
      )}
    </Portal>
  )
}

export default PinExtension
