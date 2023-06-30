import React from 'react'
import Svg, { G, Rect, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {}

const DriveIcon: React.FC<Props> = ({ ...props }) => (
  <Svg width="83" height="48" viewBox="0 0 83 48" {...props}>
    <G transform="translate(-269 15285)">
      <Rect
        width="31"
        height="34"
        rx="5"
        transform="translate(321 -15278)"
        fill="rgba(103,112,179,0.2)"
      />
      <Path
        d="M24,0H53a5,5,0,0,1,5,5V43a5,5,0,0,1-5,5H24A24,24,0,0,1,0,24v0A24,24,0,0,1,24,0Z"
        transform="translate(269 -15285)"
        fill={colors.chetwode}
      />
    </G>
  </Svg>
)

export default DriveIcon
