import React, { FC, memo } from 'react'
import { G, Path, Svg, SvgProps } from 'react-native-svg'

const SecurityIcon: FC<SvgProps> = ({ width, height, color = '#fff' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 19.33 21.511">
      <G transform="translate(-6.336 -5.237)">
        <G transform="translate(3.995 3.997)">
          <Path
            d="M20.91,11.12a11.524,11.524,0,0,1-8.4,10.81,1.96,1.96,0,0,1-1.02,0,11.524,11.524,0,0,1-8.4-10.81V6.73A2.4,2.4,0,0,1,4.48,4.67l5.57-2.28a5.187,5.187,0,0,1,3.91,0l5.57,2.28a2.421,2.421,0,0,1,1.39,2.06Z"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <Path
            d="M12,10.92h-.13a1.765,1.765,0,1,1,.13,0Z"
            transform="translate(0.011 0.004)"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <Path
            d="M10.01,13.72a1.3,1.3,0,0,0,0,2.33,3.872,3.872,0,0,0,3.97,0,1.3,1.3,0,0,0,0-2.33A3.872,3.872,0,0,0,10.01,13.72Z"
            transform="translate(0.011 0.004)"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </G>
      </G>
    </Svg>
  )
}

export default memo(SecurityIcon)
