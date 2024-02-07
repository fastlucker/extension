import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const CheckedListIcon: React.FC<SvgProps> = ({
  width = 48,
  height = 48,
  color = iconColors.secondary,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 48 48" {...rest}>
    <G opacity=".5" fill="none" stroke={color} strokeWidth="1.5">
      <G>
        <Path d="M8 0h32a8 8 0 0 1 8 8v32a8 8 0 0 1-8 8H0V8a8 8 0 0 1 8-8Z" stroke="none" />
        <Path d="M8 .75h32A7.25 7.25 0 0 1 47.25 8v32A7.25 7.25 0 0 1 40 47.25H1.5a.75.75 0 0 1-.75-.75V8A7.25 7.25 0 0 1 8 .75Z" />
      </G>
      <Path strokeLinecap="round" d="M11.337 14.107h10" />
      <Path strokeLinecap="round" d="M11.337 24h10" />
      <Path strokeLinecap="round" d="M11.337 33.893h10" />
      <Path d="m29.012 14.108 2.55 2.547 5.1-5.094" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="m29.012 24 2.55 2.547 5.1-5.094" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="m29.012 33.893 2.55 2.547 5.1-5.094" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  </Svg>
)

export default CheckedListIcon
