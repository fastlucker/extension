import React from 'react'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const MissingTokenIcon: React.FC<Props> = ({ width = 34, height = 34, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 34 34" {...rest}>
    <Rect
      width="34"
      height="34"
      rx="13"
      transform="rotate(-90 17 17)"
      fill={colors.titan}
      opacity=".05"
    />
    <Path
      stroke={colors.titan}
      strokeLinecap="round"
      d="M16.961 27.961a11 11 0 1 0-11-11 10.973 10.973 0 0 0 11 11Z"
      strokeDasharray="1 4"
    />
    <Path stroke={colors.titan} strokeLinecap="round" strokeWidth="2" d="m12.966 20.966 8-8" />
    <Path stroke={colors.titan} strokeLinecap="round" strokeWidth="2" d="m20.966 20.966-8-8" />
  </Svg>
)

export default MissingTokenIcon
