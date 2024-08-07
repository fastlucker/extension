import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const CartIcon: React.FC<SvgProps> = ({ width = 21, height = 22, color = colors.white }) => (
  <Svg width={width} height={height} viewBox="0 0 21.049 21.5">
    <G transform="translate(0.75 0.75)">
      <Path
        d="M2,2H3.74A1.85,1.85,0,0,1,5.58,4l-.83,9.96a2.8,2.8,0,0,0,2.79,3.03H18.19A2.877,2.877,0,0,0,21,14.38l.54-7.5a2.773,2.773,0,0,0-2.81-3.01H5.82"
        transform="translate(-2 -2)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M16.25,22A1.25,1.25,0,1,0,15,20.75,1.25,1.25,0,0,0,16.25,22Z"
        transform="translate(-2 -2)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M8.25,22A1.25,1.25,0,1,0,7,20.75,1.25,1.25,0,0,0,8.25,22Z"
        transform="translate(-2 -2)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M9,8H21"
        transform="translate(-2 -2)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </G>
  </Svg>
)

export default React.memo(CartIcon)
