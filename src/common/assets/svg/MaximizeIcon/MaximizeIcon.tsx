import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: string | ColorValue
}

const MaximizeIcon: React.FC<Props> = ({
  width = 24,
  height = 24,
  color = colors.martinique,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 20.12 20.121" {...rest}>
    <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5" data-name="maximize icon">
      <Path d="m5.675 14.485-4.614 4.576" data-name="Path 3303" />
      <Path d="M14.446 5.636 19.06 1.06" data-name="Path 3311" />
      <Path strokeLinejoin="round" d="M1.061 14.26v4.8h4.818" data-name="Path 3304" />
      <Path strokeLinejoin="round" d="M19.06 5.86v-4.8h-4.82" data-name="Path 3312" />
      <Path
        strokeLinejoin="round"
        d="M10.027 1.061H7.386c-4.517 0-6.324 1.8-6.324 6.3v2.653"
        data-name="Path 3309"
      />
      <Path
        strokeLinejoin="round"
        d="M10.096 19.061h2.641c4.517 0 6.324-1.8 6.324-6.3v-2.653"
        data-name="Path 3310"
      />
    </G>
  </Svg>
)

export default MaximizeIcon
