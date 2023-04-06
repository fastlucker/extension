import React from 'react'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BinIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Rect width="24" height="24" fill="none" />
    <Path
      d="M2616.5,25a3,3,0,0,1-3-3V8.5H2612a1,1,0,0,1,0-2h5.5a3.5,3.5,0,1,1,7,0h5.5a1,1,0,1,1,0,2h-1.5V22a3,3,0,0,1-3,3Zm-1-3a1,1,0,0,0,1,1h9a1,1,0,0,0,1-1V8.5h-11Zm4-15.5h3a1.5,1.5,0,0,0-3,0Zm2.5,13v-8a1,1,0,1,1,2,0v8a1,1,0,1,1-2,0Zm-4,0v-8a1,1,0,1,1,2,0v8a1,1,0,1,1-2,0Z"
      transform="translate(-2609 -2)"
      fill={colors.titan}
    />
  </Svg>
)

export default BinIcon
