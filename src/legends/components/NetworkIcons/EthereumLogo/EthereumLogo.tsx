import React from 'react'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const EthereumLogo: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none" {...rest}>
    <Rect x="1.25" y="1.25" width="29.5" height="29.5" rx="14.75" fill="white" />
    <Rect x="1.25" y="1.25" width="29.5" height="29.5" rx="14.75" stroke="#F5EDE2" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.0146 4L8.60779 16.2225L16.0151 20.5892L23.3723 16.2393L16.0146 4Z"
      fill="#62688F"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.0146 4V20.5887L23.3717 16.2387L16.0146 4Z"
      fill="#454A75"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.0146 4L8.60779 16.2225L16.0151 12.8634L23.3723 16.2393L16.0146 4Z"
      fill="#8A92B2"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.0146 4V12.8634L23.3717 16.2393L16.0146 4Z"
      fill="#62688F"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.64124 17.6226L16.0146 28L23.3922 17.6216L16.0151 21.9763L8.64124 17.6226Z"
      fill="#8A92B2"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.014 28L23.3917 17.6216L16.0146 21.9763L16.014 28Z"
      fill="#62688F"
    />
  </Svg>
)

export default React.memo(EthereumLogo)
