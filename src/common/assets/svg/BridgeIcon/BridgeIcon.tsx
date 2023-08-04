import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BridgeIcon: React.FC<Props> = ({ width = 30, height = 30 }) => (
  <Svg width={width} height={height} viewBox="0 0 30 30">
    <Path fill="none" d="M0 30V0h30v30z" />
    <G fill="none" stroke={colors.martinique} strokeLinecap="round" strokeWidth="2">
      <Path d="M12.273 26.293v-14.3L6 18.271" />
      <Path d="M17.226 3v14.3l6.273-6.279" />
    </G>
  </Svg>
)

export default BridgeIcon
