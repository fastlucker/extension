import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const MinimizeIcon: React.FC<Props> = ({ width = 20, height = 20, color = colors.martinique }) => (
  <Svg width={width} height={height} viewBox="0 0 24.001 24">
    <G transform="translate(-773 -1479)">
      <Path
        d="M789 1499a1 1 0 0 1 0-2h5a1 1 0 0 0 1-1v-14a1 1 0 0 0-1-1h-14a1 1 0 0 0-1 1v5a1 1 0 0 1-2 0v-5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3Z"
        fill={color}
      />
      <Rect
        width="11"
        height="11"
        rx="1"
        transform="translate(774 1491)"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M788.036 1483.922v2.9l3.09-3.089a.809.809 0 1 1 1.144 1.143l-3.091 3.089h2.9a.808.808 0 0 1 0 1.617h-4.85a.808.808 0 0 1-.807-.808v-4.85a.808.808 0 1 1 1.616 0Z"
        fill={color}
      />
    </G>
  </Svg>
)

export default MinimizeIcon
