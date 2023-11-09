import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const SendIcon: React.FC<Props> = ({
  width = 30,
  height = 30,
  color = colors.martinique,
  ...rest
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 16 16" {...rest}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth="1.5"
      d="m6.995 11.092 6.259-6.26-.002 5.496M2.746 11.005l6.26-6.259-5.495.002"
    />
  </Svg>
)

export default SendIcon
