import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const EmailIcon: React.FC<Props> = ({ width = 96, height = 96, color, ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 96 96" {...props}>
    <G transform="translate(-348 -239)">
      <G transform="translate(364 263)">
        <Path
          d="M60.6,6H9.4a6.2,6.2,0,0,0-6.368,6L3,48a6.228,6.228,0,0,0,6.4,6H60.6A6.228,6.228,0,0,0,67,48V12A6.228,6.228,0,0,0,60.6,6Z"
          transform="translate(-3 -6)"
          fill="none"
          stroke={color || colors.melrose}
          strokeWidth="2"
        />
        <Path
          d="M-4074.472-21252.465v6.439l25.757,15.715,25.443-16.139v-6.016l-25.443,15.674Z"
          transform="translate(4080.872 21258.77)"
          fill="none"
          stroke={color || colors.melrose}
          strokeLinecap="round"
          strokeWidth="2"
        />
      </G>
      <Rect width="96" height="96" transform="translate(348 239)" fill="none" />
    </G>
  </Svg>
)

export default EmailIcon
