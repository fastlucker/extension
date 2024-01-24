import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

const GasTankIcon: React.FC<SvgProps> = ({ width = 24, height = 24, color, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" {...rest}>
    <Rect width="24" height="24" transform="translate(0 24) rotate(-90)" fill="none" />
    <G transform="translate(4.741 4)">
      <Path
        d="M.724,16A.724.724,0,0,1,0,15.276v-.464a.724.724,0,0,1,.724-.724H9.609a.724.724,0,0,1,.724.724v.464A.724.724,0,0,1,9.609,16ZM.8,13.269V1.005A1,1,0,0,1,1.1.295,1,1,0,0,1,1.809,0H8.564A1,1,0,0,1,9.49.614a1,1,0,0,1,.079.391c-.02,7.567.046,8.247,0,12.264ZM2.665,2.7V5.553a.484.484,0,0,0,.482.482H7.126a.484.484,0,0,0,.482-.482V2.7a.484.484,0,0,0-.482-.482H3.147A.484.484,0,0,0,2.665,2.7Z"
        fill={color || colors.heliotrope}
      />
      <Path
        d="M7.212,9.849h.272a1.505,1.505,0,0,1,1.063.441,1.488,1.488,0,0,1,.441,1.063v1.5a.792.792,0,0,0,1.583-.006V9.425H9.715a.356.356,0,0,1-.356-.356V5.482a.36.36,0,0,1,.2-.324l2.2-1.03v-.8L9.552,2.189a.356.356,0,0,1,.325-.634l2.408,1.239a.355.355,0,0,1,.193.316v5.96a.357.357,0,0,1-.356.356h-.759v3.424a1.573,1.573,0,0,1-.463,1.118,1.585,1.585,0,0,1-2.579-.5,1.6,1.6,0,0,1-.121-.5h0V11.432a.793.793,0,0,0-.792-.792H7.212Z"
        transform="translate(2.357 -0.832)"
        fill={color || colors.heliotrope}
      />
    </G>
  </Svg>
)

export default GasTankIcon
