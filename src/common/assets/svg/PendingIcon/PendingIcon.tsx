import React from 'react'
import Svg, { G, Line, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const PendingIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <G id="Pending-2" transform="translate(78 849) rotate(180)">
      <Line
        y2="4"
        transform="translate(72.718 843.718) rotate(135)"
        fill="none"
        stroke={colors.heliotrope}
        strokeLinecap="round"
        strokeWidth="2"
        opacity="0"
      />
      <Line
        x1="4"
        transform="translate(71.5 837)"
        fill="none"
        stroke={colors.heliotrope}
        strokeLinecap="round"
        strokeWidth="2"
        opacity="0.25"
      />
      <Line
        y2="4"
        transform="translate(72.717 830.282) rotate(45)"
        fill="none"
        stroke={colors.heliotrope}
        strokeLinecap="round"
        strokeWidth="2"
        opacity="0.5"
      />
      <Line
        y2="4"
        transform="translate(66 827.5)"
        fill="none"
        stroke={colors.heliotrope}
        strokeLinecap="round"
        strokeWidth="2"
        opacity="0.75"
      />
      <Line
        y2="4"
        transform="translate(62.111 833.111) rotate(135)"
        fill="none"
        stroke={colors.heliotrope}
        strokeLinecap="round"
        strokeWidth="2"
      />
      <Line
        x1="3.952"
        transform="translate(56.548 837)"
        fill="none"
        stroke={colors.heliotrope}
        strokeLinecap="round"
        strokeWidth="2"
      />
      <Line
        y2="4"
        transform="translate(62.111 840.889) rotate(45)"
        fill="none"
        stroke={colors.heliotrope}
        strokeLinecap="round"
        strokeWidth="2"
      />
      <Line
        y2="4"
        transform="translate(66 842.5)"
        fill="none"
        stroke={colors.heliotrope}
        strokeLinecap="round"
        strokeWidth="2"
      />
    </G>
  </Svg>
)

export default PendingIcon
