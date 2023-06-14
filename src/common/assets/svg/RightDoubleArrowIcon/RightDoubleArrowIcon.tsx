import React from 'react'
import Svg, { Rect, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const RightArrowIcon: React.FC<Props> = ({ width = 36, height = 36, color = colors.titan }) => (
  <Svg width={width} height={height} viewBox="0 0 36 36">
    <Rect width={width} height={height} rx="12" fill="rgba(182,185,255,0.1)" />
    <Path
      id="left_arrow"
      data-name="left arrow"
      d="M6.348,0,0,6.373l6.348,6.385"
      transform="translate(18 24.379) rotate(180)"
      fill="none"
      stroke="#6000ff"
      strokeLinecap="round"
      strokeWidth="2"
    />
    <Path
      id="left_arrow-2"
      data-name="left arrow"
      d="M6.348,0,0,6.373l6.348,6.385"
      transform="translate(24.348 24.379) rotate(180)"
      fill="none"
      stroke="#6000ff"
      strokeLinecap="round"
      strokeWidth="2"
    />
  </Svg>
)

export default RightArrowIcon
