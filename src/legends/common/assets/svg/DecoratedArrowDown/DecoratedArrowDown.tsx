import React, { FC } from 'react'
import { Circle, Defs, G, Path, Svg } from 'react-native-svg'

import { LegendsSvgProps } from '@legends/types/svg'

const DecoratedArrowDown: FC<LegendsSvgProps> = ({ width = 64, height = 64, ...rest }) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 64 64" {...rest}>
      <G filter="url(#a)">
        <Circle cx="32" cy="32" r="32" fill="#000" fillOpacity=".8" />
      </G>
      <Path
        stroke="#fff"
        strokeWidth="1.5"
        d="m8.727 21.541 27.706 27.706L32 53.68l-4.433-4.433m0 0 9.974-9.974m-9.974 9.974L55.273 21.54M32 38.165l11.082-11.083L32 16 20.918 27.082z"
      />
      <Defs>
        <filter
          id="a"
          width="72"
          height="72"
          x="-4"
          y="-4"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1446_51" />
          <feBlend in="SourceGraphic" in2="effect1_backgroundBlur_1446_51" result="shape" />
        </filter>
      </Defs>
    </Svg>
  )
}

export default DecoratedArrowDown
