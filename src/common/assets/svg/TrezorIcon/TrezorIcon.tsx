import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const TrezorIcon: React.FC<Props> = ({ width = 53, height = 77 }) => (
  <Svg width={width} height={height} viewBox="0 0 53.355 77.455">
    <Path
      d="M0,64.829V23.809H8.032v-5.02a18.789,18.789,0,1,1,37.578,0v5.02h7.745v41.02L26.8,77.455ZM10.614,58.1l16.164,7.616,15.964-7.59v-23.7H10.614Zm25.53-34.288v-5.02a9.323,9.323,0,1,0-18.645,0v5.02Z"
      fill={iconColors.primary}
    />
  </Svg>
)

export default TrezorIcon
