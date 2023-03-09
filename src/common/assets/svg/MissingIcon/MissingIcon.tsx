import React from 'react'
import Svg, { G, Line, Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  withRect?: boolean
}

const MissingIcon: React.FC<Props> = ({ width = 34, height = 34, withRect = false, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 34 34" {...rest}>
    {withRect && (
      <Rect
        width="34"
        height="34"
        rx="13"
        transform="rotate(-90 17 17)"
        fill={colors.titan}
        opacity=".05"
      />
    )}
    <G transform="translate(7.5 6.5)">
      <Path
        d="M146.8,55.5a11,11,0,1,0-11-11A10.973,10.973,0,0,0,146.8,55.5Z"
        transform="translate(-137.339 -34.039)"
        fill="none"
        stroke={colors.titan}
        strokeLinecap="round"
        strokeWidth="1"
        stroke-dasharray="1 4"
      />
      <Line
        y1="8"
        x2="8"
        transform="translate(5.466 6.466)"
        fill="none"
        stroke={colors.titan}
        strokeLinecap="round"
        strokeWidth="2"
      />
      <Line
        x1="8"
        y1="8"
        transform="translate(5.466 6.466)"
        fill="none"
        stroke={colors.titan}
        strokeLinecap="round"
        strokeWidth="2"
      />
    </G>
  </Svg>
)

export default MissingIcon
