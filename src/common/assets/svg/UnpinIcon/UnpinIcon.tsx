import React from 'react'
import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const UnpinIcon: React.FC<SvgProps> = ({
  width = 24,
  height = 24,
  color = colors.martinique,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" {...rest}>
    <Defs>
      <ClipPath id="a">
        <Path fill="none" stroke={color} d="M9 8h24v24H9z" />
      </ClipPath>
    </Defs>
    <Path fill="none" d="M0 0h24v24H0z" />
    <G clipPath="url(#a)" transform="translate(-9 -8)">
      <G stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <Path
          fill={color}
          d="M12.692 21.057a7.025 7.025 0 0 1 6.065-2.646l3.036-5.257a5.508 5.508 0 0 1-.436-3.832l9.166 5.292a5.485 5.485 0 0 1-3.53 1.542l-3.037 5.259a7.017 7.017 0 0 1 .738 6.573Z"
        />
        <Path fill="none" d="m18.694 24.52-3.5 6.062" />
      </G>
    </G>
  </Svg>
)

export default UnpinIcon
