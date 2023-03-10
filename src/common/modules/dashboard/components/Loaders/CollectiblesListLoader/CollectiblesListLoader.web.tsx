// TODO: implement loader on web

import React from 'react'
import { View } from 'react-native'

import Spinner from '@common/components/Spinner'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

const CollectiblesListLoader = () => {
  return (
    <View style={[spacings.pvSm, flexboxStyles.alignCenter]}>
      <Spinner />
    </View>
  )
}

export default CollectiblesListLoader
