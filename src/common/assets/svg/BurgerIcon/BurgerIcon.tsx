import React from 'react'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BurgerIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="none" d="M0 0h24v24H0z" />
    <Rect width="18" height="2" rx="1" transform="translate(3 16)" fill={colors.titan} />
    <Rect width="14" height="2" rx="1" transform="translate(5 11)" fill={colors.titan} />
    <Rect width="18" height="2" rx="1" transform="translate(3 6)" fill={colors.titan} />
  </Svg>
)

export default BurgerIcon
