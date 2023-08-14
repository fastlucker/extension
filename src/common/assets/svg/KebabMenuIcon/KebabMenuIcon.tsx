import React from 'react'
import Svg, { Circle, G, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const KebabMenuIcon: React.FC<Props> = ({ width = 4, height = 20, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 4 20" {...rest}>
    <G transform="translate(-528.945 -10)">
      <Circle cx="2" cy="2" r="2" transform="translate(528.945 10)" fill={colors.martinique} />
      <Circle cx="2" cy="2" r="2" transform="translate(528.945 18)" fill={colors.martinique} />
      <Circle cx="2" cy="2" r="2" transform="translate(528.945 26)" fill={colors.martinique} />
    </G>
  </Svg>
)

export default KebabMenuIcon
