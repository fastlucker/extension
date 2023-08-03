import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const MaximizeIcon: React.FC<Props> = ({ width = 24, height = 24, ...rest }) => (
  <Svg width={width} height={height} {...rest}>
    <G data-name="expand icon" transform="translate(-2345 -103)">
      <Path
        d="M2361 123a1 1 0 0 1 0-2h5a1 1 0 0 0 1-1v-14a1 1 0 0 0-1-1h-14a1 1 0 0 0-1 1v5a1 1 0 0 1-2 0v-5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-5Zm2.27-10.228v-2.9l-3.09 3.089a.809.809 0 0 1-1.144-1.143l3.091-3.089h-2.9a.808.808 0 1 1 0-1.616h4.85a.807.807 0 0 1 .807.808v4.85a.808.808 0 1 1-1.616 0Z"
        fill={colors.martinique}
      />
      <Rect
        data-name="Rectangle 1099"
        width="11"
        height="11"
        rx="1"
        transform="translate(2346 115)"
        fill="none"
        stroke={colors.martinique}
        strokeWidth="2"
      />
    </G>
  </Svg>
)

export default MaximizeIcon
