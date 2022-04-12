import React from 'react'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const UpArrowIcon: React.FC<Props> = ({ width = 40, height = 40 }) => (
  <Svg width={width} height={height} viewBox="0 0 40 40">
    <Rect
      id="Rectangle_57"
      data-name="Rectangle 57"
      width="40"
      height="40"
      rx="13"
      fill={colors.titan}
      opacity="0.05"
    />
    <Path
      id="Path_7"
      data-name="Path 7"
      d="M1983,3h0l-.707.707-5,5a1,1,0,0,0,1.414,1.414L1980,8.829l3-3,1.262,1.262L1986,8.829l1.293,1.292a1,1,0,0,0,1.414-1.414l-1.293-1.292h0l-1.739-1.738-1.968-1.969-.022-.022L1983,3Z"
      transform="translate(-1963 12.586)"
      fill={colors.titan}
    />
  </Svg>
)

export default UpArrowIcon
