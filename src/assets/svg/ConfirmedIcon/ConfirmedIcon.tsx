import React from 'react'
import Svg, { G, Line, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const ConfirmedIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <G transform="translate(-349 -922)">
      <Line
        y2="13"
        transform="translate(368.192 929.404) rotate(45)"
        fill="none"
        stroke={colors.turquoise}
        strokeLinecap="round"
        strokeWidth="2"
      />
      <Line
        y2="6"
        transform="translate(354.757 934.354) rotate(-45)"
        fill="none"
        stroke={colors.turquoise}
        strokeLinecap="round"
        strokeWidth="2"
      />
    </G>
  </Svg>
)

export default ConfirmedIcon
