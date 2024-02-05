import React from 'react'
import Svg, { Circle, G, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const KebabMenuIcon: React.FC<SvgProps> = ({
  width = 4,
  height = 20,
  color = iconColors.secondary,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 4 20" {...rest}>
    <G transform="translate(-528.945 -10)">
      <Circle cx="2" cy="2" r="2" transform="translate(528.945 10)" fill={color} />
      <Circle cx="2" cy="2" r="2" transform="translate(528.945 18)" fill={color} />
      <Circle cx="2" cy="2" r="2" transform="translate(528.945 26)" fill={color} />
    </G>
  </Svg>
)

export default KebabMenuIcon
