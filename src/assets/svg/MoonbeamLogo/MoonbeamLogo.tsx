import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const MoonbeamLogo: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" {...rest}>
    <Path
      d="m16.083 6.168 5.5 3.174v12.691l-5.792 3.342L10 22.033V9.342L15.791 6l.292.168Zm.3 7.531v3.977l3.438-1.989-3.442-1.987ZM15.2 17.676V13.7l-3.439 1.987 3.439 1.989Zm5.2-.972-4.609 2.663-4.615-2.667v4.653l4.615 2.666 4.615-2.666Zm-3.438-4.02 3.444 1.987V10.7l-3.444 1.984Zm-5.786 1.987 3.444-1.987-3.444-1.984v3.971Zm.585-4.991 4.03 2.328 4.03-2.328-4.03-2.328-4.03 2.328Z"
      fill="#13b5ec"
    />
  </Svg>
)

export default MoonbeamLogo
