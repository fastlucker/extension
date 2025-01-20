import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { Circle, G, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
  fillColor?: ColorValue
}

const ReceivingIcon: React.FC<Props> = ({ width = 24, height = 24, fillColor = '#6000ff' }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32">
    <Circle cx="16" cy="16" fill={fillColor} r="16" />
    <G fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.5">
      <Path d="M12.805 15.527a1.1 1.1 0 001.065 1.121h1.2a.956.956 0 00.929-.977.847.847 0 00-.633-.929l-1.92-.672a.845.845 0 01-.641-.929.956.956 0 01.929-.977h1.2a1.1 1.1 0 011.071 1.124" />
      <Path d="M14.406 16.688v.593" />
      <Path d="M14.406 11.531v.625" />
      <Path d="M14.4 20.797A6.4 6.4 0 108 14.398a6.4 6.4 0 006.4 6.399z" />
      <Path d="M16.793 22.318a3.966 3.966 0 105.549-5.509" />
    </G>
  </Svg>
)

export default React.memo(ReceivingIcon)
