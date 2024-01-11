import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const CreateWalletIcon: React.FC<SvgProps> = ({
  width = 36,
  height = 35,
  color = iconColors.primary
}) => (
  <Svg width={width} height={height} viewBox="0 0 36 35">
    <G transform="translate(0.75 0.772)">
      <Path
        d="M27.52,17.09a3.234,3.234,0,0,0-.966,2.624,3.433,3.433,0,0,0,3.478,3.011h3.059v1.916A6.068,6.068,0,0,1,27.037,30.7H10.76a5.785,5.785,0,0,0,1.272-1.513,6.313,6.313,0,0,0,.934-3.317A6.436,6.436,0,0,0,2.5,20.842V13.806A6.067,6.067,0,0,1,8.554,7.752H27.037a6.067,6.067,0,0,1,6.054,6.054v2.318H29.839A3.209,3.209,0,0,0,27.52,17.09Z"
        transform="translate(-0.085 1.432)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M2.5,18.735V11.377a4.585,4.585,0,0,1,2.962-4.3l12.784-4.83a3.06,3.06,0,0,1,4.138,2.866v6.118"
        transform="translate(-0.085 -2.048)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M25.688,14.594v3.317a1.653,1.653,0,0,1-1.61,1.642H20.922a3.433,3.433,0,0,1-3.478-3.011,3.318,3.318,0,0,1,3.284-3.59h3.349A1.653,1.653,0,0,1,25.688,14.594Z"
        transform="translate(9.023 4.605)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M7,12H18.27"
        transform="translate(2.66 4.025)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M13.88,21.442a6.313,6.313,0,0,1-.934,3.317,5.785,5.785,0,0,1-1.272,1.513,6.287,6.287,0,0,1-4.234,1.61,6.391,6.391,0,0,1-5.506-3.123A6.313,6.313,0,0,1,1,21.442a6.44,6.44,0,1,1,12.88,0Z"
        transform="translate(-1 5.855)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M8.31,18.981h-4.8"
        transform="translate(0.532 8.283)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M5,17.522v4.814"
        transform="translate(1.44 7.392)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </G>
  </Svg>
)

export default CreateWalletIcon
