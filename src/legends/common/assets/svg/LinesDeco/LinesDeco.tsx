import React, { FC } from 'react'
import { Path, Svg } from 'react-native-svg'

import { LegendsSvgProps } from '@legends/types/svg'

const LinesDeco: FC<LegendsSvgProps> = ({ width = 328, height = 16, ...rest }) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 328 16" {...rest}>
      <Path
        stroke="#F5EFE2"
        d="M0 1h159.03L164 6.385m0 0 3.976 4.307L164 15l-3.976-4.308L164 6.385Zm0 0L168.97 1H328M210.715 4.23h-40.751L164 10.693l-5.964-6.461h-40.751"
      />
    </Svg>
  )
}

export default LinesDeco
