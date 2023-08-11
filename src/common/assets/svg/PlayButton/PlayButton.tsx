import React from 'react'
import Svg, { Circle, G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const PlayButton: React.FC<Props> = ({ width = 96, height = 96, color, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 96 96" {...rest}>
    <G transform="translate(0.409 0.409)">
      <Circle
        cx="48"
        cy="48"
        r="48"
        transform="translate(-0.409 -0.408)"
        fill={colors.melrose}
        opacity="0.2"
      />
      <Path
        d="M24.877,3.9a4,4,0,0,1,6.247,0L50.8,28.5A4,4,0,0,1,47.677,35H8.322A4,4,0,0,1,5.2,28.5Z"
        transform="translate(69.591 19.592) rotate(90)"
        fill={colors.white}
      />
    </G>
  </Svg>
)

export default PlayButton
