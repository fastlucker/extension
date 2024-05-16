import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

interface Props {
  text: string
}

const SeparatorWithText: React.FC<Props> = ({ text }) => {
  const { theme, styles } = useTheme(getStyles)

  return (
    <View style={[flexbox.directionRow, flexbox.center, spacings.mvMd]}>
      <View style={[styles.line, spacings.mrSm]} />
      <Text fontSize={20} weight="medium" color={theme.secondaryText}>
        {text}
      </Text>
      <View style={[styles.line, spacings.mlSm]} />
    </View>
  )
}

export default React.memo(SeparatorWithText)
