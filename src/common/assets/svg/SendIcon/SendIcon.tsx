import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const SendIcon: React.FC<Props> = ({
  width = 30,
  height = 30,
  color = colors.martinique,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 19.312 16" {...rest}>
    <G fill="none">
      <Path d="M1.281 16V0h16v16z" />
      <G stroke={color} strokeLinecap="round" strokeWidth="1.5">
        <Path d="m8.275 11.158 6.26-6.26-.003 5.496" />
        <Path d="m4.026 11.071 6.26-6.259-5.495.002" />
      </G>
    </G>
  </Svg>
)

export default SendIcon
