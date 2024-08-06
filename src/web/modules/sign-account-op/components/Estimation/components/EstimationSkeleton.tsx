import React from 'react'
import { View } from 'react-native'

import SkeletonLoader from '@common/components/SkeletonLoader'
import spacings from '@common/styles/spacings'

const EstimationSkeleton = () => {
  return (
    <View>
      {/* Pay fee with  */}
      <SkeletonLoader width="100%" height={21} style={spacings.mbMi} />
      <SkeletonLoader width="100%" height={54} style={spacings.mb} />
      {/* Fee speeds  */}
      <SkeletonLoader width="100%" height={24} style={spacings.mbTy} />
      <SkeletonLoader width="100%" height={96} />
    </View>
  )
}

export default EstimationSkeleton
