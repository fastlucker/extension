import React from 'react'
import Svg, { Rect, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const DownArrowIcon: React.FC<Props> = ({ width = 36, height = 36 }) => (
  <Svg width={width} height={height} viewBox="0 0 36 36">
    <Rect width={width} height={height} rx="12" fill="rgba(182,185,255,0.1)" />
    <Path
      d="M6.348,0,0,6.373l6.348,6.385"
      transform="translate(11.175 22.379) rotate(270)"
      fill="none"
      stroke={colors.violet}
      strokeLinecap="round"
      strokeWidth="2"
    />
  </Svg>
)

export default DownArrowIcon
