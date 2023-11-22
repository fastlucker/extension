import React from 'react'
import { View, ViewProps } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'

import getStyles from './styles'

interface Props extends ViewProps {
  title?: string
}

const Panel: React.FC<Props> = ({ title, children, style, ...rest }) => {
  const { styles } = useTheme(getStyles)
  return (
    <View style={[styles.container, style]} {...rest}>
      {!!title && (
        <Text
          fontSize={IS_SCREEN_SIZE_DESKTOP_LARGE ? 20 : 18}
          weight="medium"
          appearance="primaryText"
          style={IS_SCREEN_SIZE_DESKTOP_LARGE ? spacings.mbXl : spacings.mbMd}
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
