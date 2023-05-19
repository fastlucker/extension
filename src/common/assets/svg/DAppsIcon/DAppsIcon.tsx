import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { G, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: ColorValue
}

const DAppsIcon: React.FC<Props> = ({ width = 20, height = 20, color }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20">
    <G transform="translate(-30 -20)">
      <G transform="translate(30 20)">
        <G transform="translate(0 0)" fill="none" stroke={color || colors.titan} strokeWidth="2">
          <Rect width="9.412" height="9.412" rx="3" stroke="none" />
          <Rect x="1" y="1" width="7.412" height="7.412" rx="2" fill="none" />
        </G>
        <G
          transform="translate(0 10.588)"
          fill="none"
          stroke={color || colors.titan}
          strokeWidth="2"
        >
          <Rect width="9.412" height="9.412" rx="3" stroke="none" />
          <Rect x="1" y="1" width="7.412" height="7.412" rx="2" fill="none" />
        </G>
        <G
          transform="translate(10.588 0)"
          fill="none"
          stroke={color || colors.titan}
          strokeWidth="2"
        >
          <Rect width="9.412" height="9.412" rx="3" stroke="none" />
          <Rect x="1" y="1" width="7.412" height="7.412" rx="2" fill="none" />
        </G>
        <G
          transform="translate(10.588 10.588)"
          fill="none"
          stroke={color || colors.titan}
          strokeWidth="2"
        >
          <Rect width="9.412" height="9.412" rx="3" stroke="none" />
          <Rect x="1" y="1" width="7.412" height="7.412" rx="2" fill="none" />
        </G>
      </G>
    </G>
  </Svg>
)

export default DAppsIcon
