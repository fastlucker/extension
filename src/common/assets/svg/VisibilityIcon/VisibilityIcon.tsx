import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const VisibilityIcon: React.FC<SvgProps> = ({
  width = 24,
  height = 24,
  color = iconColors.primary
}) => (
  <Svg width={width} fill="none" height={height} viewBox="0 0 24 24">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M15.58 12c0 1.98-1.6 3.58-3.58 3.58S8.42 13.98 8.42 12s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z"
    />
  </Svg>
)

export default VisibilityIcon
