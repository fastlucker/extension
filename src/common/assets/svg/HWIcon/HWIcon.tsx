import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const HWIcon: React.FC<Props> = ({ width = 96, height = 96, color, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 96 96" {...rest}>
    <G transform="translate(-350.5 -242.5)">
      <G transform="translate(-237.337 -111.756)">
        <Path
          d="M41.459,0H6.541A6.441,6.441,0,0,0,0,6.338l.01,39.2a6.194,6.194,0,0,0,1.077,3.481L9.325,61.146A6.6,6.6,0,0,0,14.789,64H33.148a6.6,6.6,0,0,0,5.464-2.854l8.241-12.133a6.2,6.2,0,0,0,1.077-3.472L48,6.348A6.441,6.441,0,0,0,41.459,0"
          transform="translate(609.337 366.756)"
          fill={color || colors.violet}
          stroke={color || colors.melrose}
          strokeWidth="1"
          opacity="0"
        />
        <Path
          d="M41.459,0H6.541A6.441,6.441,0,0,0,0,6.338l.01,39.2a6.194,6.194,0,0,0,1.077,3.481L9.325,61.146A6.6,6.6,0,0,0,14.789,64H33.148a6.6,6.6,0,0,0,5.464-2.854l8.241-12.133a6.2,6.2,0,0,0,1.077-3.472L48,6.348A6.441,6.441,0,0,0,41.459,0"
          transform="translate(609.337 366.756)"
          fill="none"
          stroke={color || colors.melrose}
          strokeWidth="2"
        />
        <G transform="translate(617.224 379.729)">
          <G fill="none" stroke={color || colors.melrose} strokeWidth="2">
            <Rect width="32.226" height="20.293" rx="2" stroke="none" />
            <Rect x="1" y="1" width="30.226" height="18.293" rx="1" fill="none" />
          </G>
          <G
            transform="translate(0 24.976)"
            fill="none"
            stroke={color || colors.melrose}
            strokeWidth="2"
          >
            <Rect width="12.89" height="6.244" rx="2" stroke="none" />
            <Rect x="1" y="1" width="10.89" height="4.244" rx="1" fill="none" />
          </G>
          <G
            transform="translate(19.335 24.976)"
            fill="none"
            stroke={color || colors.melrose}
            strokeWidth="2"
          >
            <Rect width="12.89" height="6.244" rx="2" stroke="none" />
            <Rect x="1" y="1" width="10.89" height="4.244" rx="1" fill="none" />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)

export default HWIcon
