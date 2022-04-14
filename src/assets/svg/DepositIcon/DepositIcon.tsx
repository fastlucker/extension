import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const DepositIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path
      d="M10.315 22.493H6.544l.1-.506.5-2.616a6.04 6.04 0 0 1-3-5 5.115 5.115 0 0 1 .136-1.178 2.648 2.648 0 0 1-1.312-.859 1.874 1.874 0 0 1-.322-1.566.589.589 0 0 1 .576-.47.583.583 0 0 1 .493.266.586.586 0 0 1 .085.443.692.692 0 0 0 .105.612 1.548 1.548 0 0 0 .769.464 6.433 6.433 0 0 1 1.641-2.1 5.5 5.5 0 0 0 8.052-1.913h.005a3.768 3.768 0 0 1 3.125-1.508 4.516 4.516 0 0 1 1.209.155.7.7 0 0 1 .486.305.684.684 0 0 1-.089.639l-.536.966-.308.554-.013.023-.23.417a6.4 6.4 0 0 1 2.368 3.121.867.867 0 0 1 .1.012c1.684.311 1.925 1.318 1.783 3.065-.135 1.64-.777 1.847-3.21 2.377a8.088 8.088 0 0 1-2.839 1.92l.457 2.377h-3.78l-.256-1.645h-.25a10.438 10.438 0 0 1-1.8-.155l-.279 1.8Zm5.143-10.484a1.179 1.179 0 1 0 1.178-1.179 1.181 1.181 0 0 0-1.179 1.179Zm-9.457-6.51a3.5 3.5 0 1 1 3.5 3.5A3.5 3.5 0 0 1 6 5.5Z"
      fill={colors.titan}
    />
  </Svg>
)

export default DepositIcon
