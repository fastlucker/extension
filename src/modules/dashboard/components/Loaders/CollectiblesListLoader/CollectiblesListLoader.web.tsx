// TODO: implement loader on web

import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const CollectiblesListLoader = () => {
  return (
    <View style={[spacings.pvSm, flexboxStyles.alignCenter]}>
      <ActivityIndicator color={colors.electricViolet} />
    </View>
  )
}

export default CollectiblesListLoader
