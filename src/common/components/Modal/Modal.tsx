import React, { ReactNode, useEffect, useRef } from 'react'
import { Animated, Easing, Pressable, TouchableOpacity, View, ViewStyle } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { Portal } from '@gorhom/portal'

import BackButton from '../BackButton'
import getStyles from './styles'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type Props = {
  isOpen: boolean
  onClose?: () => void
  title?: string
  titleSuffix?: JSX.Element
  hideLeftSideContainer?: boolean
  modalStyle?: ViewStyle | ViewStyle[]
  children: ReactNode | ReactNode[]
  customHeader?: ReactNode
  withBackButton?: boolean
}

const Modal = ({
  isOpen,
  onClose,
  title,
  titleSuffix,
  modalStyle,
  children,
  withBackButton,
  customHeader,
  hideLeftSideContainer = false
}: Props) => {
  const { styles } = useTheme(getStyles)
  const backdropOpacity = useRef(new Animated.Value(0)).current
  const modalOpacity = useRef(new Animated.Value(0)).current
  const modalScale = useRef(new Animated.Value(0.85)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(modalOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(modalScale, {
        toValue: isOpen ? 1 : 0.85,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      })
    ]).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <Portal hostName="global">
      <AnimatedPressable
        onPress={() => !!onClose && onClose()}
        style={[
          styles.container,
          {
            opacity: backdropOpacity,
            // @ts-expect-error
            pointerEvents: isOpen ? 'auto' : 'none'
          },
          // @ts-expect-error
          !onClose && isWeb ? { cursor: 'default' } : {}
        ]}
      >
        <AnimatedPressable
          style={[
            styles.modal,
            {
              opacity: modalOpacity,
              transform: [{ scale: modalScale }]
            },
            modalStyle
          ]}
        >
          {!customHeader ? (
            <View style={styles.modalHeader}>
              {!hideLeftSideContainer && (
                <View style={styles.sideContainer}>
                  {!!onClose && withBackButton && (
                    <View style={styles.backButton}>
                      <BackButton onPress={onClose} />
                    </View>
                  )}
                </View>
              )}
              {!!title && (
                <Text fontSize={20} weight="medium" style={!!titleSuffix && spacings.mrSm}>
                  {title}
                </Text>
              )}
              {titleSuffix}
              <View style={styles.sideContainer}>
                {!!onClose && !withBackButton && (
                  <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                    <CloseIcon />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            customHeader
          )}
          {children}
        </AnimatedPressable>
      </AnimatedPressable>
    </Portal>
  )
}

export default Modal
