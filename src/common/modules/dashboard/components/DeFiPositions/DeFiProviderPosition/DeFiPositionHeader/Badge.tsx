import React from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const Badge = ({
  text,
  type
}: {
  text: string
  type: 'success' | 'info' | 'error' | 'warning'
}) => {
  const { theme } = useTheme()
  return (
    <View
      style={{
        ...spacings.phTy,
        ...flexbox.justifyCenter,
        height: 28,
        borderRadius: 14,
        backgroundColor: `${String(theme[`${type}Decorative`])}14`
      }}
    >
      <Text fontSize={12} weight="medium" appearance={`${type}Text`}>
        {text}
      </Text>
    </View>
  )
}

export default React.memo(Badge)
