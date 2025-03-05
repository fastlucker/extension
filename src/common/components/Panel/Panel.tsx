import React, { ReactNode } from 'react'
import { Animated, View, ViewProps } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import { WindowSizes } from '@common/hooks/useWindowSize/types'
import spacings, { SPACING_3XL, SPACING_LG, SPACING_XL } from '@common/styles/spacings'

import getStyles from './styles'

interface Props extends ViewProps {
  title?: string | ReactNode
  forceContainerSmallSpacings?: boolean
  isAnimated?: boolean
}

export const getPanelPaddings = (
  maxWidthSize: (size: WindowSizes) => boolean,
  forceContainerSmallSpacings?: boolean
) => {
  return {
    paddingHorizontal:
      maxWidthSize('xl') && !forceContainerSmallSpacings ? SPACING_3XL : SPACING_XL,
    paddingVertical: maxWidthSize('xl') && !forceContainerSmallSpacings ? SPACING_XL : SPACING_LG
  }
}

const Panel: React.FC<Props> = ({
  title,
  children,
  forceContainerSmallSpacings,
  style,
  isAnimated,
  ...rest
}) => {
  const { styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()

  const Container = isAnimated ? Animated.View : View

  return (
    <Container
      style={[styles.container, getPanelPaddings(maxWidthSize, forceContainerSmallSpacings), style]}
      {...rest}
    >
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

export default Panel
