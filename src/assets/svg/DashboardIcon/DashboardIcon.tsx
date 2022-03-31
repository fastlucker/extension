import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const DashboardIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      d="M18 20h-5v-9h7v7a2 2 0 0 1-2 2Zm-7 0H6a2 2 0 0 1-2-2v-3h7v5Zm0-7H4V6a2 2 0 0 1 2-2h5v9Zm9-4h-7V4h5a2 2 0 0 1 2 2v3Z"
      fill={colors.titan}
    />
  </Svg>
)

export default DashboardIcon
