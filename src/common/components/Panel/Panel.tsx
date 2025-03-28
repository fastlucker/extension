import React, { ReactNode } from 'react'
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
  showProgress?: boolean
  step?: number
  totalSteps?: number
  onBackPress?: () => void
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
  showProgress = false,
  step = 1,
  totalSteps = 2,
  onBackPress,
  ...rest
}) => {
  const { styles, theme } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()

  const Container = isAnimated ? Animated.View : View

  return (
    <Container
      style={[styles.container, getPanelPaddings(maxWidthSize, spacingsSize), style]}
      {...rest}
    >
      {showProgress && (
        <View style={[flexbox.directionRow, spacings.mbMd]}>
          {[...Array(totalSteps)].map((_, index) => (
            <View
              key={`step-${index}`} // TODO: Remove index as key
              style={{
                flex: 1,
                height: 4,
                backgroundColor: index < step ? theme.successDecorative : theme.tertiaryBackground,
                ...(index > 0 && { ...spacings.mlMi })
              }}
            />
          ))}
        </View>
      )}

      {(!!title || !!withBackButton) && (
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            maxWidthSize('xl') ? spacings.mbXl : spacings.mbMd
          ]}
        >
          {!!withBackButton && (
            <Pressable onPress={onBackButtonPress} style={[spacings.prSm, spacings.pvTy]}>
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
    </Container>
  )
}

export default React.memo(Panel)
