import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: string
  disabled?: boolean
  props?: any
}

const LeftArrowIcon: React.FC<Props> = ({
  width = 36,
  height = 36,
  color = iconColors.primary,
  disabled = false,
  ...props
}) => (
  <Svg width={width} height={height} viewBox="0 0 36 36" {...props}>
    <G transform="translate(36 36) rotate(180)">
      <Path
        d="M6.348,0,0,6.373l6.348,6.385"
        transform="translate(22.175 24.379) rotate(180)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="2"
        opacity={disabled ? 0.3 : 1}
      />
    </G>
  </Svg>
)

export default LeftArrowIcon
