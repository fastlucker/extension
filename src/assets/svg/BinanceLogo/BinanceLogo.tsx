import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BinanceLogo: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" {...rest}>
    <Path
      d="M21.948 19.769 16 25.716l-5.947-5.947 2.168-2.168L16 21.384l3.784-3.783 2.168 2.168ZM16 13.822 18.178 16 16 18.178 13.823 16 16 13.822Zm-7.548 4.346L6.284 16l2.168-2.168L10.62 16Zm15.1-4.336L25.72 16l-2.168 2.168L21.384 16l2.168-2.168ZM16 6.284l5.947 5.947-2.163 2.168L16 10.62l-3.779 3.779-2.168-2.168Z"
      fill="#ffbc00"
    />
  </Svg>
)

export default BinanceLogo
