// TODO: implement loader on web

import React from 'react'
import { View } from 'react-native'

import Spinner from '@modules/common/components/Spinner'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const TokensListLoader = () => {
  return (
    <View style={[spacings.pvSm, flexboxStyles.alignCenter]}>
      <Spinner />
    </View>
  )
}

export default TokensListLoader
