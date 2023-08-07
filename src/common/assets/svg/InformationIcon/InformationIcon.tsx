import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

import colors from '@common/styles/colors'

const InformationIcon: React.FC<any> = ({
  color = colors.martinique_65,
  width = 18,
  height = 18
}) => (
  <Svg width={width} height={height}>
    <G>
      <Path fill="none" d="M18 18H0V0h18z" />
      <Path
        d="M9 1.5A7.5 7.5 0 1 1 1.5 9 7.508 7.508 0 0 1 9 1.5Zm0 6a.75.75 0 1 0-.75-.751A.751.751 0 0 0 9 7.5Zm0 6a.751.751 0 0 0 .75-.75V9a.75.75 0 0 0-1.5 0v3.75a.751.751 0 0 0 .75.75Z"
        fill={color}
      />
    </G>
  </Svg>
)

export default InformationIcon
