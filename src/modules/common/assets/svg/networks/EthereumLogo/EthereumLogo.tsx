import React from 'react'
import Svg, { Path, Polygon, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const EthereumLogo: React.FC<Props> = ({ width = 11, height = 18, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 784.37 1277.39" {...rest}>
    <Polygon
      fill="#343434"
      fillRule="nonzero"
      points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
    />
    <Polygon
      fill="#8C8C8C"
      fillRule="nonzero"
      points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
    />
    <Polygon
      fill="#3C3C3B"
      fillRule="nonzero"
      points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
    />
    <Polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 " />
    <Polygon
      fill="#141414"
      fillRule="nonzero"
      points="392.07,882.29 784.13,650.54 392.07,472.33 "
    />
    <Polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 " />
  </Svg>
)

export default EthereumLogo
