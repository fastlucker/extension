import React from 'react'
import Svg, { Path } from 'react-native-svg'

import colors from '@modules/common/styles/colors'

interface Props {
  type: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const CameraCorners: React.FC<Props> = ({ type }) => (
  <Svg width="22" height="22" viewBox="0 0 22 22">
    {type === 'top-left' && (
      <Path
        d="M-1133-2014h-9a12.919,12.919,0,0,1-9.193-3.807A12.919,12.919,0,0,1-1155-2027v-9h3v9a10.011,10.011,0,0,0,10,10h9v3Z"
        transform="translate(-2013.999 1155) rotate(90)"
        fill={colors.turquoise}
      />
    )}
    {type === 'top-right' && (
      <Path
        d="M22,0H13A13,13,0,0,0,0,13v9H3V13A10.011,10.011,0,0,1,13,3h9V0Z"
        transform="translate(22.001) rotate(90)"
        fill={colors.turquoise}
      />
    )}
    {type === 'bottom-left' && (
      <Path
        d="M-1133-2014h-9a12.919,12.919,0,0,1-9.193-3.807A12.919,12.919,0,0,1-1155-2027v-9h3v9a10.011,10.011,0,0,0,10,10h9v3Z"
        transform="translate(1155 2036)"
        fill={colors.turquoise}
      />
    )}
    {type === 'bottom-right' && (
      <Path
        d="M-1155-2014h9a12.919,12.919,0,0,0,9.193-3.807A12.919,12.919,0,0,0-1133-2027v-9h-3v9a10.011,10.011,0,0,1-10,10h-9v3Z"
        transform="translate(1155 2036)"
        fill={colors.turquoise}
      />
    )}
  </Svg>
)

export default CameraCorners
