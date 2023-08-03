import React from 'react'
import Svg, { G, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BurgerIcon: React.FC<Props> = ({ width = 50, height = 50 }) => (
  <Svg width={width} height={height} viewBox="0 0 50 50">
    <G transform="translate(-805.75 -1501.5)">
      <Rect
        width="22.5"
        height="2.5"
        rx="1.25"
        transform="translate(819.75 1531)"
        fill={colors.martinique}
      />
      <Rect
        width="17.5"
        height="2.5"
        rx="1.25"
        transform="translate(822.25 1524.75)"
        fill={colors.martinique}
      />
      <Rect
        width="22.5"
        height="2.5"
        rx="1.25"
        transform="translate(819.75 1518.5)"
        fill={colors.martinique}
      />
    </G>
  </Svg>
)

export default BurgerIcon
