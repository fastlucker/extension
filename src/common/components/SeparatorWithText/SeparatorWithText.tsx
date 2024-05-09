import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

interface Props {
  text: string
}

const SeparatorWithText: React.FC<Props> = ({ text }) => {
  const { theme, styles } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text fontSize={20} weight="medium" color={theme.secondaryText}>
        {text}
      </Text>
      <View style={styles.line} />
    </View>
  )
}

export default React.memo(SeparatorWithText)
