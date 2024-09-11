import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

const LockIcon: React.FC<SvgProps> = ({
  width = 18,
  height = 25.5,
  color = iconColors.primary
}) => (
  <Svg width={width} height={height} viewBox="0 0 17.964 25.655">
    <Path
      d="M9.031 22.085 7.648 20.7v-3.674a3.06 3.06 0 0 1-1.734-2.773 3.086 3.086 0 1 1 4.454 2.763v.33l-.539.539.539.764-.539.76.824.91-1.622 1.764Zm-.036-9.823a.994.994 0 1 0 .995.991.992.992 0 0 0-.995-.991Z"
      fill="none"
    />
    <Path
      d="M2.75 9.748v-3a6.124 6.124 0 0 1 6.233-6 6.124 6.124 0 0 1 6.232 6v2.994L10.452 8.26a5.377 5.377 0 0 0-1.476-.184 5.234 5.234 0 0 0-1.462.184L2.752 9.748Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <Path
      d="M7.527 8.267 2.751 9.835a2.936 2.936 0 0 0-2 2.51v6.2a3.9 3.9 0 0 0 1.656 2.869l4.116 2.677a4.9 4.9 0 0 0 4.92 0l4.116-2.677a3.9 3.9 0 0 0 1.656-2.869v-6.2a2.937 2.937 0 0 0-2-2.518l-4.775-1.56a5.556 5.556 0 0 0-2.913 0Z"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </Svg>
)

export default React.memo(LockIcon)
