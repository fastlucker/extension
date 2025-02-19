import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { Circle, G, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
  fillColor?: ColorValue
}

const TupUpWithBgIcon: React.FC<Props> = ({ width = 24, height = 24, fillColor = '#0f6dd2' }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32">
    <Circle cx="16" cy="16" fill={fillColor} r="16" />
    <G fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.5">
      <Path d="M13.264 17.916a1.871 1.871 0 001.827 1.914h2.056a1.629 1.629 0 001.586-1.673 1.445 1.445 0 00-1.083-1.586l-3.292-1.148a1.437 1.437 0 01-1.083-1.586 1.635 1.635 0 011.589-1.674h2.056a1.871 1.871 0 011.824 1.914" />
      <Path d="M15.998 11.079v9.844" />
      <Path d="M24 16a8 8 0 11-8-8" />
      <Path d="M20.481 8.704v2.814h2.815" />
      <Path d="M24 8l-3.519 3.514" />
    </G>
  </Svg>
)

export default React.memo(TupUpWithBgIcon)
