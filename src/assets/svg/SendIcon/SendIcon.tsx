import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const SendIcon: React.FC<Props> = ({ width = 24, height = 24, color, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" {...rest}>
    <Path fill="none" d="M0 24V0h24v24z" />
    <Path
      data-name="Path 93"
      d="m5.92 7.54 9.125-.007-9.454 9.454a.976.976 0 0 1-.693.286.978.978 0 0 1-.693-.288.98.98 0 0 1-.001-1.386l6.104-6.104H5.924a.981.981 0 0 1-.98-.98.975.975 0 0 1 .287-.694.974.974 0 0 1 .688-.281ZM19.2 6.149l-.007 9.126a.98.98 0 0 1-.98.98.982.982 0 0 1-.979-.98V10.89l-6.104 6.104a.979.979 0 0 1-1.385 0 .979.979 0 0 1-.289-.693.976.976 0 0 1 .287-.693Z"
      fill={color || colors.titan}
    />
  </Svg>
)

export default SendIcon
