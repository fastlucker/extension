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
  type?: 'default' | 'onboarding'
  title?: string | ReactNode
  isAnimated?: boolean
  spacingsSize?: 'small' | 'large'
  withBackButton?: boolean
  onBackButtonPress?: () => void
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
  type = 'default',
  title,
  children,
  style,
  isAnimated,
  spacingsSize = 'large',
  withBackButton,
  onBackButtonPress = () => {},
  step = 0,
  totalSteps = 2,
  panelWidth = 400,
  ...rest
}) => {
  const { styles, theme } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()
  const animation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (type === 'onboarding' && isAnimated) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 480,
        useNativeDriver: false
      }).start()
    }
  }, [animation, isAnimated, type])

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
    <View style={[flexbox.directionRow]}>
      {[...Array(totalSteps)].map((_, index) => (
        <View
          key={`step-${index.toString()}`}
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

  if (type === 'onboarding') {
    return (
      <Animated.View
        style={[
          styles.onboardingContainer,
          {
            width: isAnimated ? panelWidthInterpolate : panelWidth
          }
        ]}
      >
        {step > 0 && renderProgress()}
        <Animated.View
          style={[
            styles.innerContainer,
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
          {(!!title || !!withBackButton) && (
            <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbMd]}>
              {!!withBackButton && (
                <Pressable onPress={onBackButtonPress} style={[spacings.pvTy]}>
                  {({ hovered }: any) => (
                    <View
                      style={[
                        styles.backBtnWrapper,
                        hovered && { backgroundColor: theme.secondaryBackground }
                      ]}
                    >
                      <LeftArrowIcon />
                    </View>
                  )}
                </Pressable>
              )}
              {!!title && (
                <Text
                  fontSize={maxWidthSize('xl') ? 20 : 18}
                  weight="semiBold"
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

  // default version
  const Container = isAnimated ? Animated.View : View

  return (
    <Container style={[styles.container, getPanelPaddings(maxWidthSize, 'large'), style]} {...rest}>
      {!!title && (
        <Text
          fontSize={maxWidthSize('xl') ? 20 : 18}
          weight="medium"
          appearance="primaryText"
          style={maxWidthSize('xl') ? spacings.mbXl : spacings.mbMd}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
      {children}
    </Container>
  )
}

export default React.memo(Panel)
