import React from 'react'
import { View, ViewProps } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings, { SPACING_3XL, SPACING_LG, SPACING_XL } from '@common/styles/spacings'

import getStyles from './styles'

interface Props extends ViewProps {
  title?: string
  forceContainerSmallSpacings?: boolean
}

const Panel: React.FC<Props> = ({
  title,
  children,
  forceContainerSmallSpacings,
  style,
  ...rest
}) => {
  const { styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal:
            maxWidthSize('xl') && !forceContainerSmallSpacings ? SPACING_3XL : SPACING_XL,
          paddingVertical:
            maxWidthSize('xl') && !forceContainerSmallSpacings ? SPACING_XL : SPACING_LG
        },
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
    </View>
  )
}

export default Panel
