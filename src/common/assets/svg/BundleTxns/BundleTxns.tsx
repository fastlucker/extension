import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BundleTxns: React.FC<Props> = ({ width = 37, height = 34, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 37.4 34.807" {...rest}>
    <G transform="translate(18920.023 -2012.295)">
      <Rect
        width="29"
        height="4"
        rx="2"
        transform="translate(-18915.734 2018.111)"
        fill="#cacde6"
      />
      <Rect
        width="29"
        height="4"
        rx="2"
        transform="translate(-18915.734 2025.111)"
        fill="#cacde6"
      />
      <Path
        d="M-18905.5,2045.961a32.691,32.691,0,0,1,.475-5.24c.557-3.681,3.865-19.013,19.449-25.619-1.234,15.874-7.172,24.042-17.955,21.952"
        transform="translate(2.11 0.387)"
        fill="#f2f3fa"
        stroke="#8b3dff"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <Path
        d="M-18889.705,2020.141s-1.113,2.584-5.254,2.871"
        transform="translate(5.288 1.934)"
        fill="none"
        stroke="#8b3dff"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <Path
        d="M-18891.447,2026.842s-2.561,1.615-7.168.5"
        transform="translate(4.156 3.992)"
        fill="none"
        stroke="#8b3dff"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <Path
        d="M31.073,0H2.961A2.764,2.764,0,0,0,0,2.952V20.644A2.764,2.764,0,0,0,2.961,23.6H12"
        transform="translate(-18919.273 2013.045)"
        fill="none"
        stroke="#8b3dff"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </G>
  </Svg>
)

export default BundleTxns
