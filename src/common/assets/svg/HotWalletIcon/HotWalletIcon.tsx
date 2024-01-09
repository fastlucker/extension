import React, { FC } from 'react'
import { G, Path, Svg, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const HotWalletIcon: FC<SvgProps> = ({
  width = 61,
  height = 60,
  color = colors.martinique,
  ...rest
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 61.504 59.872" {...rest}>
      <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <Path d="M48.032 32.789a5.543 5.543 0 0 0-1.656 4.5 5.885 5.885 0 0 0 5.964 5.161h5.244v3.284a10.4 10.4 0 0 1-10.38 10.378h-27.9a9.918 9.918 0 0 0 2.18-2.594 10.822 10.822 0 0 0 1.6-5.686A11.034 11.034 0 0 0 5.14 39.22V27.159a10.4 10.4 0 0 1 10.378-10.378h31.686a10.4 10.4 0 0 1 10.377 10.378v3.97h-5.575a5.5 5.5 0 0 0-3.974 1.66Z" />
        <Path d="M5.14 29.643V17.03a7.86 7.86 0 0 1 5.079-7.37l21.915-8.28a5.245 5.245 0 0 1 7.093 4.909v10.492" />
        <Path d="M60.503 33.949v5.686a2.834 2.834 0 0 1-2.76 2.815h-5.41a5.885 5.885 0 0 1-5.962-5.161 5.687 5.687 0 0 1 5.631-6.155h5.741a2.834 2.834 0 0 1 2.76 2.815Z" />
        <Path d="M17.56 28.509h19.321" />
        <Path d="M23.081 47.832a10.822 10.822 0 0 1-1.6 5.686 9.918 9.918 0 0 1-2.18 2.594 10.778 10.778 0 0 1-7.259 2.76A10.957 10.957 0 0 1 2.6 53.518 10.822 10.822 0 0 1 1 47.832a11.04 11.04 0 1 1 22.081 0Z" />
        <Path d="M16.158 47.775H7.933" />
        <Path d="M12.04 43.746v8.253" />
      </G>
    </Svg>
  )
}

export default HotWalletIcon
