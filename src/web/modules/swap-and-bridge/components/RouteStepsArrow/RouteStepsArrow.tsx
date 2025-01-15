import React, { ReactElement, useEffect, useMemo, useRef } from 'react'
import { Animated, View, ViewStyle } from 'react-native'

import CheckIcon from '@common/assets/svg/CheckIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

const RouteStepsArrow = ({
  containerStyle,
  badge,
  badgeStyle,
  badgePosition = 'middle',
  type,
  isLoading
}: {
  containerStyle?: ViewStyle
  badge?: ReactElement | null
  badgePosition?: 'top' | 'middle'
  badgeStyle?: ViewStyle
  type?: 'default' | 'warning' | 'success'
  isLoading?: boolean
}) => {
  const { styles, theme } = useTheme(getStyles)
  const spinAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!isLoading) return

    const startAnimation = () => {
      Animated.loop(
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: !isWeb
        })
      ).start()
    }

    startAnimation()
  }, [spinAnimation, isLoading])

  const getArrowColor = useMemo(() => {
    if (type === 'warning') return theme.warningDecorative
    if (type === 'success') return theme.successDecorative

    return theme.secondaryBorder
  }, [theme, type])

  const spinInterpolate = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.arrowLine,
          type === 'success' && styles.arrowLineSuccess,
          { borderColor: getArrowColor }
        ]}
      >
        {!(badgePosition === 'middle' && !!badge) && (
          <View>
            {type === 'success' ? (
              <CheckIcon width={12} height={12} color={theme.successDecorative} />
            ) : (
              <Animated.View
                style={[
                  styles.arrowStatus,
                  { borderColor: getArrowColor },
                  !!isLoading && {
                    borderStyle: 'dashed',
                    transform: [{ rotateZ: spinInterpolate || '0deg' }]
                  }
                ]}
              />
            )}
          </View>
        )}
        {!!badge && (
          <View style={{ backgroundColor: theme.secondaryBackground }}>
            <View
              style={[
                badgePosition === 'middle' && styles.badgeMiddle,
                badgePosition === 'top' && styles.badgeTop,

                badgeStyle
              ]}
            >
              {badge}
            </View>
          </View>
        )}
      </View>
      <View style={[styles.arrowTipWrapper]}>
        <View style={[styles.arrowConnector, { borderColor: getArrowColor }]} />
        <RightArrowIcon color={getArrowColor} height={11} />
      </View>
    </View>
  )
}

export default React.memo(RouteStepsArrow)
