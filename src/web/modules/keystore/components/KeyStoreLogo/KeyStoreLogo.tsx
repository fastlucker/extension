import React from 'react'
import { View } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import LockSvg from './LockSvg'

const KeyStoreLogo = ({ hasSpacings = true }: { hasSpacings?: boolean }) => (
  <View style={[hasSpacings && spacings.ptTy, hasSpacings && spacings.pbLg]}>
    <View style={[flexbox.alignCenter, flexbox.justifyCenter, hasSpacings && spacings.pvLg]}>
      <LockSvg />
    </View>
  </View>
)

export default React.memo(KeyStoreLogo)
