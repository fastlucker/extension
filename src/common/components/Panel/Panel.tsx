import React, { ReactNode, useEffect, useRef } from 'react'
import { Animated, Pressable, View, ViewProps } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import { WindowSizes } from '@common/hooks/useWindowSize/types'
import spacings, { SPACING_3XL, SPACING_LG, SPACING_XL } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

import getStyles from './styles'

interface Props extends ViewProps {
  withBackButton?: boolean
  onBackButtonPress?: () => void
  title?: string | ReactNode
  spacingsSize?: 'small' | 'large'
  isAnimated?: boolean
  step?: number
  totalSteps?: number
  panelWidth?: number
}

export const getPanelPaddings = (
  maxWidthSize: (size: WindowSizes) => boolean,
  spacingsSize: 'small' | 'large' = 'large'
) => {
  return {
    paddingHorizontal: maxWidthSize('xl') && spacingsSize === 'large' ? SPACING_3XL : SPACING_LG,
    paddingVertical: maxWidthSize('xl') && spacingsSize === 'large' ? SPACING_XL : SPACING_LG
  }
}

const Panel: React.FC<Props> = ({
  withBackButton,
  onBackButtonPress = () => {},
  title,
  children,
  style,
  spacingsSize = 'large',
  isAnimated,
  step = 0,
  totalSteps = 2,
  panelWidth = 400,
  ...rest
}) => {
  const { styles, theme } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const animation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isAnimated) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 480,
        useNativeDriver: false
      }).start()
    }
  }, [animation, isAnimated])

  const panelWidthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, panelWidth],
    extrapolate: 'clamp'
  })

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  const renderProgress = () => (
    <View style={[flexbox.directionRow, spacings.mbMd]}>
      {[...Array(totalSteps)].map((_, index) => (
        <View
          key={`step-${_}`} // TODO: Remove index as key
          style={[
            styles.progress,
            index > 0 ? spacings.mlMi : undefined,
            {
              backgroundColor: index < step ? theme.successDecorative : theme.tertiaryBackground
            }
          ]}
        />
      ))}
    </View>
  )

  return (
    <Animated.View
      style={[styles.container, { width: isAnimated ? panelWidthInterpolate : panelWidth }]}
    >
      <Animated.View
        style={[
          styles.container,
          getPanelPaddings(maxWidthSize, spacingsSize),
          style,
          {
            width: isAnimated ? panelWidthInterpolate : panelWidth,
            opacity: isAnimated ? opacityInterpolate : 1,
            minWidth: panelWidth
          }
        ]}
        {...rest}
      >
        {step > 0 && renderProgress()}

        {(!!title || !!withBackButton) && (
          <View
            style={[
              flexbox.directionRow,
              flexbox.alignCenter,
              maxWidthSize('xl') ? spacings.mbXl : spacings.mbMd
            ]}
          >
            {!!withBackButton && (
              <Pressable
                onPress={onBackButtonPress}
                style={[spacings.prSm, spacings.pvTy, spacings.plMd]}
              >
                <LeftArrowIcon />
              </Pressable>
            )}
            {!!title && (
              <Text
                fontSize={maxWidthSize('xl') ? 20 : 18}
                weight="medium"
                appearance="primaryText"
                numberOfLines={1}
                style={[text.center, flexbox.flex1]}
              >
                {title}
              </Text>
            )}
            <View style={{ width: 20 }} />
          </View>
        )}
        {children}
      </Animated.View>
    </Animated.View>
  )
}

export default React.memo(Panel)
