import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const EarnIcon: React.FC<Props> = ({ width = 24, height = 24, color }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      d="M11.046 20.908a.5.5 0 0 1-.5-.5v-1.43a4.129 4.129 0 0 1-3.605-4h3a1.917 1.917 0 0 0 2.12 1.86c1.319 0 2.1-.7 2.1-1.7 0-3.019-7.2-1.2-7.18-6.26a3.94 3.94 0 0 1 3.566-3.918V3.6a.5.5 0 0 1 .5-.5h2.108a.5.5 0 0 1 .5.5v1.45A4.038 4.038 0 0 1 16.9 8.82h-3.08a1.843 1.843 0 0 0-2-1.661c-1.1-.04-1.92.5-1.92 1.641 0 2.8 7.16 1.239 7.16 6.16a4.125 4.125 0 0 1-3.406 4.009v1.44a.5.5 0 0 1-.5.5Z"
      fill={color || colors.titan}
    />
  </Svg>
)

export default EarnIcon
