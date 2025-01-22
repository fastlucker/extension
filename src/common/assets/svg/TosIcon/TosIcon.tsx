import React, { FC } from 'react'
import { G, Path, Svg, SvgProps } from 'react-native-svg'

const TosIcon: FC<SvgProps> = ({ width = 24, height = 24, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 22.568 24.75" width={width} height={height} {...rest}>
      <G fill="none" stroke={color} strokeWidth="1.5">
        <Path strokeLinecap="round" strokeLinejoin="round" d="M6.545 15.273H12" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="M6.545 10.909h8.727" />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.818 2.182h6.545c3.633.2 5.455 1.538 5.455 6.535v8.738"
        />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.182 9.829v7.6c0 4.375 1.091 6.567 6.545 6.567h6.545"
        />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.818 17.455 15.273 24v-3.272q0-3.273 3.273-3.273Z"
        />
        <G>
          <circle cx="4.364" cy="4.364" r="4.364" stroke="none" />
          <circle cx="4.364" cy="4.364" r="3.614" />
        </G>
        <Path strokeLinecap="round" strokeLinejoin="round" d="M3.799 5.43 2.718 4.349" />
        <Path strokeLinecap="round" strokeLinejoin="round" d="m6.009 3.245-2.21 2.21" />
      </G>
    </Svg>
  )
}

export default React.memo(TosIcon)
