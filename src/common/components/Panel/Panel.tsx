import React from 'react'
import { Animated, View, ViewProps } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_3XL, SPACING_LG, SPACING_XL } from '@common/styles/spacings'

import getStyles from './styles'

interface Props extends ViewProps {
  title?: string
  forceContainerSmallSpacings?: boolean
  isAnimated?: boolean
}

export const getPanelPaddings = (isXl: boolean, forceContainerSmallSpacings?: boolean) => {
  return {
    paddingHorizontal: isXl && !forceContainerSmallSpacings ? SPACING_3XL : SPACING_XL,
    paddingVertical: isXl && !forceContainerSmallSpacings ? SPACING_XL : SPACING_LG
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
      style={[
        styles.container,
        getPanelPaddings(maxWidthSize('xl'), forceContainerSmallSpacings),
        style
      ]}
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
