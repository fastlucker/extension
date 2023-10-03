import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const WarningIcon: React.FC<Props> = ({ width = 22, height = 20 }) => (
  <Svg width={width} height={height} viewBox="0 0 22 20">
    <G id="warning_icon" data-name="warning icon" transform="translate(-617.177 -1740.453)">
      <Path
        d="M32,29v5"
        transform="translate(595.949 1718.61)"
        fill="none"
        stroke={colors.pirateGold}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
      <Path
        d="M32,41.41H25.94c-3.47,0-4.92-2.48-3.24-5.51l3.12-5.62L28.76,25c1.78-3.21,4.7-3.21,6.48,0l2.94,5.29,3.12,5.62c1.68,3.03.22,5.51-3.24,5.51H32Z"
        transform="translate(595.951 1718.61)"
        fill="none"
        stroke={colors.pirateGold}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      />
      <Path
        d="M31.994,37H32"
        transform="translate(595.957 1718.61)"
        fill="none"
        stroke={colors.pirateGold}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </G>
  </Svg>
)

export default WarningIcon
