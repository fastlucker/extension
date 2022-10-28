// TODO: implement loader on web
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import colors from '@modules/common/styles/colors'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const CollectibleLoader = () => {
  return (
    <View
      style={[
        flexboxStyles.alignCenter,
        flexboxStyles.justifyCenter,
        flexboxStyles.flex1,
        { width: '100%', height: '100%' }
      ]}
    >
      <ActivityIndicator color={colors.electricViolet} />
    </View>
  )
}

export default CollectibleLoader
