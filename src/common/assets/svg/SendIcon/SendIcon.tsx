import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const SendIcon: React.FC<Props> = ({
  width = 31,
  height = 30,
  color = colors.martinique,
  ...rest
}) => (
  <Svg width={width} height={height} {...rest}>
    <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="2">
      <Path d="M13.298 19.685 23.41 9.573l-.003 8.877" />
      <Path d="M6.436 19.546 16.547 9.434l-8.875.004" />
    </G>
  </Svg>
)

export default SendIcon
