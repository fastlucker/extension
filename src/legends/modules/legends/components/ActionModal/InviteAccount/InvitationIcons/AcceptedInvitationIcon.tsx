import React from 'react'
import Svg, { Circle, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const AcceptedInvitationIcon: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none" {...rest}>
    <Circle cx="8" cy="8.49951" r="8" fill="#62804D" />
    <Path
      d="M5 8.85053L7.43243 11.2995L12.2 6.49951"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
)

export default React.memo(AcceptedInvitationIcon)
