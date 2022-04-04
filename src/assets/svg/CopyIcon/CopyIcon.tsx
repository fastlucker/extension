import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const CopyIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      d="M9 22.999a3 3 0 0 1-3-3v-12a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3Zm-1-15v12a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1Zm-6 8v-9a6.007 6.007 0 0 1 6-6h7a1 1 0 0 1 0 2H8a4 4 0 0 0-4 4v9a1 1 0 1 1-2 0Z"
      fill={colors.titan}
    />
  </Svg>
)

export default CopyIcon
