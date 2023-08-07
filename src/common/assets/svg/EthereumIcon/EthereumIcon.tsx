import React from 'react'
import Svg, { Path } from 'react-native-svg'

const EthereumIcon: React.FC<any> = ({ ...props }) => (
  <Svg width="11.971" height="19.433" {...props}>
    <Path d="M6 0 0 9.9l6 3.536 5.955-3.526Z" fill="#62688f" fillRule="evenodd" />
    <Path d="M5.997 0v13.432l5.957-3.522Z" fill="#454a75" fillRule="evenodd" />
    <Path d="M6 0 0 9.9l6-2.72 5.955 2.73Z" fill="#8a92b2" fillRule="evenodd" />
    <Path d="M5.997 0v7.177l5.957 2.733Z" fill="#62688f" fillRule="evenodd" />
    <Path d="m.027 11.03 5.97 8.4 5.974-8.4-5.974 3.526Z" fill="#8a92b2" fillRule="evenodd" />
    <Path d="m5.997 19.432 5.974-8.4-5.974 3.526Z" fill="#62688f" fillRule="evenodd" />
  </Svg>
)

export default EthereumIcon
