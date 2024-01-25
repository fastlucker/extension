import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const TrezorIcon: React.FC<SvgProps> = ({
  width = 46,
  height = 69,
  color = iconColors.primary
}) => (
  <Svg width={width} height={height} viewBox="0 0 45.639 69.135">
    <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <Path d="M1 25h43.639v32.182l-21.65 10.953L1.001 57.182Z" />
      <Path d="M23 1h0a14 14 0 0 1 14 14v10h0H9h0V15A14 14 0 0 1 23 1Z" />
    </G>
  </Svg>
)

export default TrezorIcon
