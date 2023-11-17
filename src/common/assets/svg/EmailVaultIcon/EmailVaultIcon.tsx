import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const EmailVaultIcon: React.FC<SvgProps> = ({
  width = 24,
  height = 24,
  color = colors.martinique
}) => (
  <Svg width={width} height={height} viewBox="0 0 21.5 18.5">
    <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
      <Path d="M15.75 17.75h-10c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z" />
      <Path d="m15.75 6.25-3.13 2.5a3.166 3.166 0 0 1-3.75 0l-3.12-2.5" />
    </G>
  </Svg>
)

export default EmailVaultIcon
