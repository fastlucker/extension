import React from 'react'
import { View, ViewProps } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

interface Props extends ViewProps {
  index?: number
}

export const Row: React.FC<Props> = ({ index = 0, style, children, ...rest }) => {
  return (
    <View
      style={[
        flexboxStyles.directionRow,
        spacings.pvSm,
        spacings.ph,
        { backgroundColor: index % 2 ? colors.rowEvenColor : colors.rowOddColor },
        !!style && style
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}
