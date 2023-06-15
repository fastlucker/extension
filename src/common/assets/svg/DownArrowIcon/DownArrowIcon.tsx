import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  isActive?: boolean
}

const DownArrowIcon: React.FC<Props> = ({ width = 15, height = 9, isActive = false }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 15.586 9.173"
    transform={isActive ? 'rotate(180)' : 'rotate(0)'}
  >
    <Path
      d="M6.347,12.758,0,6.385,6.347,0"
      transform="translate(1.414 7.761) rotate(-90)"
      fill="none"
      stroke={colors.martinique}
      strokeLinecap="round"
      strokeWidth="2"
    />
  </Svg>
)

export default DownArrowIcon
