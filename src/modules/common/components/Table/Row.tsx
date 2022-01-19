import React from 'react'
import { View } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Props {
  index?: number
}

export const Row: React.FC<Props> = ({ index = 0, children }) => {
  return (
    <View
      style={[
        flexboxStyles.directionRow,
        spacings.pvSm,
        { backgroundColor: index % 2 ? colors.rowEvenColor : colors.rowOddColor }
      ]}
    >
      {children}
    </View>
  )
}
