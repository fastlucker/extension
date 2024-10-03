import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const LatticeIcon: React.FC<SvgProps> = ({
  width = 119,
  height = 40,
  color = iconColors.primary
}) => (
  <Svg width={width} height={height} viewBox="0 4 118.571 39.514">
    <G fill="none" stroke={color} strokeWidth="4">
      <Path d="M24.05 11.518C18.804 7.569.999 8.692.999 23.547s17.45 17.154 24.407 11.318c.117-.061 0-8.9 0-8.9" />
      <Path d="M38.346 38.961V9.5h8.49c7.017 0 10.376 4.359 10.376 9.033 0 8.059-5.866 9.227-10.941 9.227h-7.452" />
      <Path d="m56.871 38.961-7.5-11.3" />
      <Path d="M70.946 9.5v29.252" />
      <Path d="M93.333 9.5h-8.076l.043 28.182s2.128-.041 6.944-.041c10.512 0 16.942-3.605 16.942-14.018" />
      <Path d="M99.571 9.5h19" />
      <Path d="M109.071 0v19" />
    </G>
  </Svg>
)

export default LatticeIcon
