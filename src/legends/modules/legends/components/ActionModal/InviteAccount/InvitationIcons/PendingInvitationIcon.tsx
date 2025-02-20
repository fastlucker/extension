import React from 'react'
import Svg, { Circle, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const PendingInvitationIcon: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none" {...rest}>
    <Circle cx="8" cy="8.49951" r="8" fill="#B38824" />
    <Path
      d="M10.9686 11.0483L8.48859 9.57135C8.26016 9.41849 8.07042 9.2146 7.93435 8.97579C7.79828 8.73698 7.71962 8.4698 7.70459 8.19535V4.90674"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default React.memo(PendingInvitationIcon)
