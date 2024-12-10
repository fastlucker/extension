import React, { FC } from 'react'
import { Path, Svg } from 'react-native-svg'

import { LegendsSvgProps } from '@legends/types/svg'

const LinesDeco2: FC<LegendsSvgProps> = ({ width = 231, height = 14, ...rest }) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 231 14" {...rest}>
      <Path stroke="#B0ACA4" d="M0 .5h231M33 3.5h80.5L118 8l-2 2-2-2 4.5-4.5h80" />
      <Path stroke="#B0ACA4" d="m116 13 5-5-5-5-5 5z" />
    </Svg>
  )
}

export default LinesDeco2
