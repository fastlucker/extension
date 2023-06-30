import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { Rect, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  isActive?: boolean
  withRect?: boolean
  color?: ColorValue
}

const DownArrowIcon: React.FC<Props> = ({
  width = 36,
  height = 36,
  isActive = false,
  withRect = true,
  color = colors.violet
}) => (
  <Svg width={width} height={height} viewBox="0 0 36 36">
    {withRect && <Rect width={width} height={height} rx="12" fill="rgba(182,185,255,0.1)" />}
    <Path
      d="M6.348,0,0,6.373l6.348,6.385"
      transform={`${
        isActive ? 'translate(24 15) rotate(90)' : 'translate(11.175 22.379) rotate(270)'
      }`}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="2"
    />
  </Svg>
)

export default DownArrowIcon
