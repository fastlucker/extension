import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import colors from '@modules/common/styles/colors'

interface Props extends SvgProps {
  color?: string
  width?: number
  height?: number
}

const RewardsFlag: React.FC<Props> = ({ width = 73, height = 84, color, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 73 84" {...rest}>
    <Path d="M.5.5v72.234l36.2 11.271 36.2-11.271V.495Z" fill={color} stroke={colors.titan} />
  </Svg>
)

export default RewardsFlag
