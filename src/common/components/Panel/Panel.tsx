import React, { ReactNode } from 'react'
import { Animated, TouchableOpacity, View, ViewProps } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import { WindowSizes } from '@common/hooks/useWindowSize/types'
import spacings, { SPACING_3XL, SPACING_LG, SPACING_XL } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

interface Props extends ViewProps {
  title?: string | ReactNode
  spacingsSize?: 'small' | 'large'
  isAnimated?: boolean
  showProgress?: boolean
  step?: number
  totalSteps?: number
  showBackButton?: boolean
  onBackPress?: () => void
  showHeader?: boolean // Controls whether the header should be shown
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
  title,
  children,
  style,
  spacingsSize = 'large',
  isAnimated,
  showProgress = false,
  step = 1,
  totalSteps = 2,
  showBackButton = false,
  onBackPress,
  showHeader = true,
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
              key={index}
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
      {showHeader && (showBackButton || title) && (
        <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbSm, spacings.phMd]}>
          {showBackButton && (
            <TouchableOpacity onPress={onBackPress} style={spacings.mrMd}>
              <LeftArrowIcon width={24} color={theme.primaryText} />
            </TouchableOpacity>
          )}
          {!!title && (
            <Text
              fontSize={maxWidthSize('xl') ? 20 : 18}
              weight="semiBold"
              appearance="primaryText"
              numberOfLines={1}
              style={{ textAlign: 'center' }}
            >
              {title}
            </Text>
          )}
        </View>
      )}

      {children}
    </Container>
  )
}

export default React.memo(Panel)
