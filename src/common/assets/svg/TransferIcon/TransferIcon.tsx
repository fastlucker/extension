import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const TransferIcon: React.FC<Props> = ({ width = 24, height = 24, color }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      d="M4.293 10.824A1 1 0 0 1 4 10.117a1 1 0 0 1 1-1h11.816l-3.168-3.159a1 1 0 0 1 0-1.414 1 1 0 0 1 1.414 0l6.594 6.576H5.003a1 1 0 0 1-.71-.296Z"
      fill={color || colors.titan}
    />
    <Path
      d="M19.941 13.41a1 1 0 0 1 .293.708 1 1 0 0 1-1 1l-11.818.002 3.17 3.156a1 1 0 0 1 0 1.415 1 1 0 0 1-1.413 0l-6.59-6.576 16.651.003a1 1 0 0 1 .707.293Z"
      fill={color || colors.titan}
    />
  </Svg>
)

export default TransferIcon
