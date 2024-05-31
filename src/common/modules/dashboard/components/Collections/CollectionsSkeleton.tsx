import React from 'react'

import SkeletonLoader from '@common/components/SkeletonLoader'
import spacings from '@common/styles/spacings'

const Skeleton = ({ amount = 5 }: { amount?: number }) => {
  // Needed so react keys are generated outside of the return statement
  const skeletonItems = Array.from({ length: amount }, (_, index) => {
    return {
      key: index
    }
  })

  return (
    <>
      {skeletonItems.map((item) => (
        <SkeletonLoader key={item.key} width="100%" height={185} style={spacings.mbSm} />
      ))}
    </>
  )
}

export default React.memo(Skeleton)
