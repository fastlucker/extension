import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const ReceiveIcon: React.FC<Props> = ({ width = 24, height = 24, color, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" {...rest}>
    <Path fill="none" d="M0 24V0h24v24z" />
    <Path
      d="m18.153 16.38-9.186.048 9.56-9.56a.992.992 0 0 1 .698-.293.978.978 0 0 1 .7.291.986.986 0 0 1-.005 1.395l-6.172 6.172 4.41-.026a.977.977 0 0 1 .983.982.991.991 0 0 1-.291.7.992.992 0 0 1-.697.29ZM4.777 17.838l.049-9.186a1 1 0 0 1 .99-.99.976.976 0 0 1 .981.981l-.022 4.414 6.172-6.172a.986.986 0 0 1 1.395-.005.978.978 0 0 1 .29.7.993.993 0 0 1-.292.698Z"
      fill={colors.titan}
    />
  </Svg>
)

export default ReceiveIcon
