import React from 'react'
import Svg, { Circle, G, Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const ViewModeIcon: React.FC<SvgProps> = ({
  width = 39,
  height = 25,
  color = iconColors.primary
}) => (
  <Svg width={width} height={height} viewBox="0 0 38.554 25.256">
    <G transform="translate(0.75 0.75)">
      <Path
        d="M28.643,23.756a8.412,8.412,0,0,1-8.26-6.813h0a1.876,1.876,0,0,0-3.71,0h0a8.338,8.338,0,0,1-1.029,2.7A8.412,8.412,0,1,1,2.006,9.892L8.323,2.05A4.99,4.99,0,0,1,10.046.559,4.946,4.946,0,0,1,17.22,4.193a1.981,1.981,0,0,1,1.25-.442h.114a1.98,1.98,0,0,1,1.25.442,4.944,4.944,0,0,1,8.9-2.142l6.527,8.1v0a8.408,8.408,0,0,1-6.616,13.606Zm.171-13.981a5.569,5.569,0,1,0,5.569,5.569A5.576,5.576,0,0,0,28.814,9.775Zm-20.346,0a5.569,5.569,0,1,0,5.569,5.569A5.576,5.576,0,0,0,8.468,9.775Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <G
        transform="translate(16.485 8.961)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      >
        <Circle cx="2.042" cy="2.042" r="2.042" stroke="none" />
        <Circle cx="2.042" cy="2.042" r="1.292" fill="none" />
      </G>
      <Path
        d="M38,0a3.469,3.469,0,0,1,3.469,3.469"
        transform="translate(-29.69 11.875)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <Path
        d="M38,0a3.469,3.469,0,0,1,3.469,3.469"
        transform="translate(-9.274 11.875)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </G>
  </Svg>
)

export default React.memo(ViewModeIcon)
