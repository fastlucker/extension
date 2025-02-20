import React from 'react'
import Svg, { Circle, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const ExpiredInvitationIcon: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none" {...rest}>
    <Circle cx="8" cy="8.49951" r="8" fill="#991E1E" />

    <Path d="M5 11.4995L10.76 5.49951" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <Path d="M11 11.4995L5.24 5.49951" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </Svg>
)

export default React.memo(ExpiredInvitationIcon)
