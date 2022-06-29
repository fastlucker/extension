import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: ColorValue
}

const WalletIcon: React.FC<Props> = ({ width = 24, height = 24, color }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path
      d="M17.639 18.476c1.103 0 2-.897 2-2V9.96c0-1.103-.897-2-2-2H6.236V5.525h-.875a1 1 0 0 0-1 1v9.951c0 1.103.897 2 2 2h11.278m0 1H6.361a3 3 0 0 1-3-3V6.525a2 2 0 0 1 2-2h1.875v2.435h10.403a3 3 0 0 1 3 3v6.516a3 3 0 0 1-3 3z"
      fill={color || colors.titan}
    />
    <G stroke={color || colors.titan}>
      <G fill="#363a5d">
        <Rect width="14" height="3.45" rx="1.725" stroke="none" x="3.361" y="4.525" />
        <Rect x="3.861" y="5.025" width="13" height="2.45" rx="1.225" fill="none" />
      </G>
      <G fill="none">
        <Path strokeLinecap="round" d="M6.639 10.129h3.775" />
        <Path d="M17 12.286h2.889c.061 0 .111.05.111.111v1.778c0 .061-.05.111-.111.111H17a1 1 0 0 1-1-1h0a1 1 0 0 1 1-1z" />
      </G>
    </G>
  </Svg>
)

export default WalletIcon
