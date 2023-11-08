import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const LedgerIcon: React.FC<Props> = ({ width = 56, height = 56 }) => (
  <Svg width={width} height={height} viewBox="0 0 56.709 56.709">
    <Path
      d="M47.508,0H21.592V34.974H56.565V9.057A9.036,9.036,0,0,0,47.508,0ZM13.514,0H9.057A9.036,9.036,0,0,0,0,9.057v4.457H13.514ZM0,21.592H13.514V35.106H0ZM43.194,56.565h4.457a9.036,9.036,0,0,0,9.057-9.057V43.194H43.194Zm-21.6-13.371H35.106V56.709H21.592ZM0,43.194v4.457a9.036,9.036,0,0,0,9.057,9.057h4.457V43.194Z"
      transform="translate(0 0)"
      fill={iconColors.primary}
    />
  </Svg>
)

export default LedgerIcon
