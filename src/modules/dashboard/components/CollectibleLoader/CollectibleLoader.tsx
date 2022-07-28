import React from 'react'
import ContentLoader, { Circle, Rect } from 'react-content-loader/native'

import colors from '@modules/common/styles/colors'

const CollectibleLoader = ({ height }: { height: number }) => {
  return (
    <ContentLoader
      animate
      speed={1.5}
      interval={0.15}
      height={height}
      style={{ width: '100%', position: 'absolute' }}
      viewBox="0 0 100 100"
      backgroundColor={colors.chetwode}
      foregroundColor={colors.baileyBells}
    >
      <Rect x="18" y="0" rx="3" ry="3" width="82" height="12" />
      <Rect x="18" y="16" rx="2" ry="2" width="82" height="8" />
      <Rect x="0" y="28" rx="4" ry="4" width="48" height="48" />
      <Rect x="54" y="28" rx="3" ry="3" width="46" height="8" />
      <Rect x="54" y="40" rx="4" ry="4" width="46" height="36" />
      <Circle x="4" y="84" r="4" />
      <Rect x="12" y="81" rx="2" ry="2" width="76" height="6" />
    </ContentLoader>
  )
}

export default CollectibleLoader
