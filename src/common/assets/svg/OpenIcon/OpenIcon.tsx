import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: ColorValue
}

const OpenIcon: React.FC<Props> = ({ width = 24, height = 24, color }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path
      d="M2613.842,21A2.845,2.845,0,0,1,2611,18.157V5.842A2.846,2.846,0,0,1,2613.842,3h4.263a.947.947,0,0,1,0,1.894h-4.263a.949.949,0,0,0-.948.947V18.157a.949.949,0,0,0,.948.947h12.316a.948.948,0,0,0,.947-.947V13.9a.947.947,0,1,1,1.895,0v4.262A2.845,2.845,0,0,1,2626.158,21Zm2.646-5.488a.948.948,0,0,1,0-1.339l9.278-9.277h-3.4a.947.947,0,1,1,0-1.894h5.685a.947.947,0,0,1,.947.947V9.632a.947.947,0,0,1-1.895,0v-3.4l-9.277,9.277a.947.947,0,0,1-1.34,0Z"
      transform="translate(-2608 0)"
      fill={color || colors.titan}
    />
  </Svg>
)

export default OpenIcon
