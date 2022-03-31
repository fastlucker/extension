import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const CrossChainIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="none" d="M0 24V0h24v24z" />
    <Path
      fill={colors.titan}
      d="M10.824 21.707a1 1 0 0 1-.707.293 1 1 0 0 1-1-1v-8.816l-3.16 3.168a1 1 0 0 1-1.414 0 1 1 0 0 1 0-1.414l6.576-6.594v13.654a1 1 0 0 1-.295.709Z"
    />
    <Path
      fill={colors.titan}
      d="M13.41 2.058a1 1 0 0 1 .707-.292 1 1 0 0 1 1 1v8.815l3.16-3.168a1 1 0 0 1 1.414 0 1 1 0 0 1 0 1.414l-6.575 6.594.001-13.655a1 1 0 0 1 .293-.708Z"
    />
  </Svg>
)

export default CrossChainIcon
