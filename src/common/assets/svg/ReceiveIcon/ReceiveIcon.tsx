import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: string | ColorValue
}

const ReceiveIcon: React.FC<Props> = ({
  width = 24,
  height = 24,
  color = colors.martinique,
  ...rest
}) => (
  <Svg viewBox="0 0 23.988 18.609" width={width} height={height} {...rest}>
    <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5">
      <Path d="M13.668 4.829 5.58 12.917l.002-7.1" data-name="Path 2205" />
      <Path d="m19.159 4.94-8.089 8.089 7.101-.003" data-name="Path 2206" />
    </G>
  </Svg>
)

export default ReceiveIcon
