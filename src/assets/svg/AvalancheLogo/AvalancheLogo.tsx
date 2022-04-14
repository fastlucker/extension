import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const AvalancheLogo: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" {...rest}>
    <Path
      d="m7.101 21.231 8.364-14.834a.786.786 0 0 1 1.364 0l2.357 4.077a2.281 2.281 0 0 1 .015 2.256l-4.7 8.4a2.461 2.461 0 0 1-2.147 1.258H7.771a.77.77 0 0 1-.67-1.148Zm13.876-5.153-2.931 5.076a.816.816 0 0 0 .707 1.224h5.861a.816.816 0 0 0 .707-1.224l-2.928-5.075a.816.816 0 0 0-1.414 0Z"
      fill="#e84142"
    />
  </Svg>
)

export default AvalancheLogo
