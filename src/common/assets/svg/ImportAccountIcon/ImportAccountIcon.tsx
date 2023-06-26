import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const ImportAccountIcon: React.FC<Props> = ({ width = 96, height = 96, color, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 96 96" {...rest}>
    <G transform="translate(-348 -239)">
      <Rect width="96" height="96" transform="translate(348 239)" fill="none" />
      <G transform="translate(-4 3.477)">
        <Path
          d="M64,6V23c0,3.314-3.07,6-6.857,6H6.857C3.07,29,0,26.314,0,23V6"
          transform="translate(368 274.523)"
          fill="none"
          stroke={color || colors.melrose}
          strokeWidth="2"
        />
        <G transform="translate(393.324 263.523)">
          <Path
            d="M396,264.658V292.6"
            transform="translate(-389.331 -264.658)"
            fill="none"
            stroke={color || colors.melrose}
            strokeLinecap="round"
            strokeWidth="2"
          />
          <Path
            d="M402.6,287l-6.634,6.634L389.331,287"
            transform="translate(-389.331 -264.658)"
            fill="none"
            stroke={color || colors.melrose}
            strokeLinecap="round"
            strokeWidth="2"
          />
        </G>
      </G>
    </G>
  </Svg>
)

export default ImportAccountIcon
