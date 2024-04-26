import './Skeleton.css'

import React, { memo } from 'react'

import useTheme from '@common/hooks/useTheme'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

import { SkeletonLoaderProps } from './types'

const SkeletonLoader = ({
  width,
  height,
  borderRadius = BORDER_RADIUS_PRIMARY,
  style = {},
  lowOpacity = false
}: SkeletonLoaderProps & {
  style: React.CSSProperties
}) => {
  const { theme } = useTheme()

  return (
    <div
      className={`skeleton${lowOpacity ? ' low-opacity' : ''}`}
      style={{
        width,
        height,
        background: theme.secondaryBackground as any,
        borderRadius,
        ...style
      }}
    />
  )
}

export default memo(SkeletonLoader)
