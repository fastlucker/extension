// TODO: implement loader on web
import React from 'react'
import { View } from 'react-native'

import Spinner from '@common/components/Spinner'
import flexboxStyles from '@common/styles/utils/flexbox'

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
      <Spinner />
    </View>
  )
}

export default CollectibleLoader
