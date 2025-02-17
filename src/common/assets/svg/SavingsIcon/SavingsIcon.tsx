import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { Circle, G, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
  fillColor?: ColorValue
}

const SavingsIcon: React.FC<Props> = ({ width = 24, height = 24, fillColor = '#018649' }) => (
  <Svg id="save_icon" width={width} height={height} viewBox="0 0 32 32">
    <Circle cx="16" cy="16" fill={fillColor} r="16" />
    <G fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.5">
      <Path d="M15.002 19.289v1.624a2.691 2.691 0 01-2.856 2.488 2.7 2.7 0 01-2.866-2.488v-1.624a2.593 2.593 0 002.864 2.352 2.6 2.6 0 002.858-2.352z" />
      <Path d="M15 17.088a2.1 2.1 0 01-.3 1.088 2.94 2.94 0 01-2.56 1.264 2.958 2.958 0 01-2.56-1.264 2.1 2.1 0 01-.3-1.088 2.324 2.324 0 01.832-1.752 3.053 3.053 0 012.024-.728 3.1 3.1 0 012.024.728 2.275 2.275 0 01.84 1.752z" />
      <Path d="M15.002 17.088v2.2a2.59 2.59 0 01-2.856 2.352 2.6 2.6 0 01-2.866-2.352v-2.2a2.693 2.693 0 012.864-2.488 3.1 3.1 0 012.026.728 2.34 2.34 0 01.832 1.76z" />
      <Path d="M24 14.576v1.648a.821.821 0 01-.8.816h-1.568a1.706 1.706 0 01-1.728-1.5 1.648 1.648 0 011.632-1.784H23.2a.821.821 0 01.8.82z" />
      <Path d="M8 14.2v-1.6a3.723 3.723 0 013.352-3.952A4.258 4.258 0 0112 8.6h7.2a3.658 3.658 0 01.6.04 3.731 3.731 0 013.4 3.96v1.16h-1.664a1.648 1.648 0 00-1.636 1.784 1.706 1.706 0 001.728 1.5H23.2v1.16a3.779 3.779 0 01-4 4h-2" />
    </G>
  </Svg>
)

export default React.memo(SavingsIcon)
