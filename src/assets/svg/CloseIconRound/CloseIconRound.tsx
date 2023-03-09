import React from 'react'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const CloseIconRound: React.FC<Props> = ({ width = 18, height = 18, color }) => (
  <Svg width={width} height={height} viewBox="0 0 18 18">
    <Rect width="18" height="18" rx="9" fill={color || colors.turquoise} opacity="0.16" />
    <Path
      d="M7.643,8.429a.783.783,0,0,1-.556-.23L-.77.341A.786.786,0,0,1-.77-.77a.786.786,0,0,1,1.111,0L8.2,7.087a.786.786,0,0,1-.556,1.341Z"
      transform="translate(5.286 5.286)"
      fill={color || colors.turquoise}
    />
    <Path
      d="M-.214,8.429A.783.783,0,0,1-.77,8.2a.786.786,0,0,1,0-1.111L7.087-.77A.786.786,0,0,1,8.2-.77.786.786,0,0,1,8.2.341L.341,8.2A.783.783,0,0,1-.214,8.429Z"
      transform="translate(5.286 5.286)"
      fill={color || colors.turquoise}
    />
  </Svg>
)

export default CloseIconRound
