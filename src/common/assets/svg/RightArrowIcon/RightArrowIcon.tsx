import React from 'react'
import Svg, { Rect, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: string
  hovered?: boolean
  props?: SvgProps
}

const RightArrowIcon: React.FC<Props> = ({
  width = 36,
  height = 36,
  color = colors.violet,
  hovered = false,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 36 36" {...props}>
    <Rect
      width={width}
      height={height}
      rx="12"
      fill={hovered ? 'rgba(96, 0, 255, 0.08)' : 'rgba(182,185,255,0.1)'}
    />
    <Path
      d="M6.348,0,0,6.373l6.348,6.385"
      transform="translate(22.175 24.379) rotate(180)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="2"
    />
  </Svg>
)

export default RightArrowIcon
