import React from 'react'
import { SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: string
}

const ErrorOutlineIcon: React.FC<Props> = ({
  width = 20,
  height = 18,
  color = iconColors.warning
}) => (
  <svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 9v5m0 7.41H5.94c-3.47 0-4.92-2.48-3.24-5.51l3.12-5.62L8.76 5c1.78-3.21 4.7-3.21 6.48 0l2.94 5.29 3.12 5.62c1.68 3.03.22 5.51-3.24 5.51H12v-.01Z"
    />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11.995 17h.009"
    />
  </svg>
)

export default ErrorOutlineIcon
