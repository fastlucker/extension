import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const LeftArrowIcon: React.FC<Props> = ({ width = 40, height = 40 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40">
    <G data-name="left-arrow icon" transform="translate(157 -213) rotate(90)">
      <Rect
        id="Rectangle_57"
        width="40"
        height="40"
        rx="13"
        transform="translate(213 117)"
        fill={colors.titan}
        opacity="0.05"
      />
      <Path
        d="M1983,10.413h0l-.707-.707-5-5a1,1,0,0,1,1.414-1.414L1980,4.586l3,3,1.262-1.262L1986,4.586l1.293-1.292a1,1,0,0,1,1.414,1.414L1987.414,6h0l-1.739,1.738-1.968,1.969-.022.022-.685.685Z"
        transform="translate(-1750 131)"
        fill={colors.titan}
      />
    </G>
  </Svg>
)

export default LeftArrowIcon
