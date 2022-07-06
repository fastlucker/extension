import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  viewBoxWidth?: number
  viewBoxHeight?: number
  color?: ColorValue
}
// 12.8 15.3
const GasTankIcon: React.FC<Props> = ({
  width = 24,
  height = 24,
  viewBoxWidth,
  viewBoxHeight,
  color
}) => (
  <Svg
    width={width}
    height={height}
    viewBox={`0 0 ${viewBoxWidth || '24'} ${viewBoxHeight || '24'}`}
  >
    <Rect width="24" height="24" transform="translate(0 24) rotate(-90)" fill="none" />
    <G transform="translate(5.741 5.25)">
      <Path
        d="M.611,13.5A.611.611,0,0,1,0,12.889V12.5a.611.611,0,0,1,.611-.611h7.5a.611.611,0,0,1,.611.611v.392a.611.611,0,0,1-.611.611Zm.068-2.3V.848a.844.844,0,0,1,.249-.6A.844.844,0,0,1,1.526,0h5.7a.847.847,0,0,1,.781.518.845.845,0,0,1,.067.33c-.017,6.384.039,6.958,0,10.348Zm1.57-8.92V4.685a.408.408,0,0,0,.407.407H6.013a.408.408,0,0,0,.407-.407V2.276a.408.408,0,0,0-.407-.407H2.655A.408.408,0,0,0,2.248,2.276Z"
        fill={color || colors.heliotrope}
      />
      <Path
        d="M7.212,8.547h.229a1.27,1.27,0,0,1,.9.372,1.256,1.256,0,0,1,.372.9v1.267a.668.668,0,0,0,1.336-.005V8.189H9.324a.3.3,0,0,1-.3-.3V4.862A.3.3,0,0,1,9.2,4.589l1.858-.869V3.044L9.186,2.083a.3.3,0,0,1,.274-.535l2.031,1.045a.3.3,0,0,1,.163.266V7.888a.3.3,0,0,1-.3.3h-.64v2.889a1.327,1.327,0,0,1-.391.943A1.337,1.337,0,0,1,8.147,11.6a1.345,1.345,0,0,1-.1-.42h0V9.883a.669.669,0,0,0-.668-.668H7.212Z"
        transform="translate(0.862 -0.938)"
        fill={color || colors.heliotrope}
      />
    </G>
  </Svg>
)

export default GasTankIcon
