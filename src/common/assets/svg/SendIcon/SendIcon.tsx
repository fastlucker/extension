import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const SendIcon: React.FC<SvgProps> = ({
  width = 26,
  height = 26,
  color = colors.martinique,
  strokeWidth = '1.5',
  ...rest
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 26 26" {...rest}>
    <G fill="none">
      <Path d="M0 26V0h26v26z" />
      <G stroke={color} strokeLinecap="round" strokeWidth="1.5">
        <Path d="M11.585 17.467 20.4 8.652l-.004 7.738" />
        <Path d="m5.6 17.345 8.815-8.815-7.737.003" />
      </G>
    </G>
  </Svg>
)

export default SendIcon
