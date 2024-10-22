import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const EthereumLogo: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" {...rest}>
    <Path d="m16 6-6 9.9 6 3.536 5.955-3.526Z" fill="#62688f" />
    <Path d="M15.997 6v13.432l5.957-3.522Z" fill="#454a75" />
    <Path d="m16 6-6 9.9 6-2.72 5.955 2.73Z" fill="#8a92b2" />
    <Path d="M15.997 6v7.177l5.957 2.733Z" fill="#62688f" />
    <Path d="m10.027 17.03 5.97 8.4 5.974-8.4-5.974 3.526Z" fill="#8a92b2" />
    <Path d="m15.997 25.432 5.974-8.4-5.974 3.526Z" fill="#62688f" />
  </Svg>
)

export default React.memo(EthereumLogo)
