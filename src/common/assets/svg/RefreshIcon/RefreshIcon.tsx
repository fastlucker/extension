import React from 'react'
import { Path, Svg } from 'react-native-svg'

import colors from '@common/styles/colors'

const RefreshIcon = ({ color = colors.martinique, width = 32, height = 32 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M22 12c0 5.52-4.48 10-10 10s-8.89-5.56-8.89-5.56m0 0h4.52m-4.52 0v5M2 12C2 6.48 6.44 2 12 2c6.67 0 10 5.56 10 5.56m0 0v-5m0 5h-4.44"
      />
    </Svg>
  )
}

export default RefreshIcon
