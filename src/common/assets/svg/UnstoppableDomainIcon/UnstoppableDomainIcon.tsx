import React from 'react'
import Svg, { G, Path, Rect } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'
import { LegendsSvgProps } from '@legends/types/svg'

interface Props extends LegendsSvgProps {
  isActive?: boolean
}

const UnstoppableDomainIcon: React.FC<Props> = ({ width = 24, height = 24, isActive, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 25 25" {...rest}>
    <G transform="translate(-1401 -296)">
      <Rect width="25" height="25" transform="translate(1401 296)" fill="none" />
      <G transform="translate(319.17 -302.562)" opacity={isActive ? 1 : 0.25}>
        <Path d="M1106.83,603v8.7l-25,10.13Z" transform="translate(0 -3.463)" fill="#a0a0a0" />
        <Path
          d="M7.881,79.926A7.844,7.844,0,0,1,3.474,78.58,7.9,7.9,0,0,1,.619,75.113,7.83,7.83,0,0,1,0,72.046V65.9l4.746-2.619V72.09a2.731,2.731,0,1,0,5.463,0V60.262L15.761,57.2V72.046a7.844,7.844,0,0,1-1.346,4.406,7.9,7.9,0,0,1-3.467,2.855A7.83,7.83,0,0,1,7.881,79.926Z"
          transform="translate(1086.412 542)"
          fill={iconColors.primary}
        />
      </G>
    </G>
  </Svg>
)

export default UnstoppableDomainIcon
