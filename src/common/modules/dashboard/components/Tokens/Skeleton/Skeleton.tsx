import React from 'react'

import SkeletonLoader from '@common/components/SkeletonLoader'
import spacings from '@common/styles/spacings'

const Skeleton = () => {
  return (
    <>
      <SkeletonLoader width="100%" height={21} style={spacings.mbTy} />
      <SkeletonLoader width="100%" height={52} style={spacings.mbMi} />
      <SkeletonLoader width="100%" height={52} style={spacings.mbMi} />
      <SkeletonLoader width="100%" height={52} style={spacings.mbMi} />
      <SkeletonLoader width="100%" height={52} style={spacings.mbMi} />
      <SkeletonLoader width="100%" height={52} style={spacings.mbMi} />
    </>
  )
}

export default Skeleton
