import React, { FC } from 'react'
import { Path, Svg } from 'react-native-svg'

import { LegendsSvgProps } from '@legends/types/svg'

const RhombusDeco2: FC<LegendsSvgProps> = ({ width = 20, height = 34, ...rest }) => {
  return (
    <Svg fill="none" viewBox="0 0 20 34" width={width} height={height} {...rest}>
      <Path fill="#374D26" d="M11.2 10.333 4.4 17l6.8 6.667L18 17l-6.8-6.667Z" />
      <Path fill="#374D26" d="M11.2 10.333 4.4 17l6.8 6.667L18 17l-6.8-6.667Z" />
      <Path
        stroke="#374D26"
        strokeWidth="1.5"
        d="m1 7 10.2 10L1 27m3.4-10 6.8-6.667L18 17l-6.8 6.667L4.4 17Z"
      />
      <Path stroke="#374D26" strokeWidth="1.5" d="m1 1 6 6-6 6M1 21l6 6-6 6" />
      <Path
        fill="#6FFF00"
        d="M10.293 21.293a1 1 0 0 0 1.414 0l3.586-3.586a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0l-3.586 3.586a1 1 0 0 0 0 1.414l3.586 3.586Z"
      />
      <Path
        stroke="#374D26"
        d="M10.293 21.293a1 1 0 0 0 1.414 0l3.586-3.586a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0l-3.586 3.586a1 1 0 0 0 0 1.414l3.586 3.586Z"
      />
    </Svg>
  )
}

export default RhombusDeco2
