import React, { FC } from 'react'
import { Path, Svg, SvgProps } from 'react-native-svg'

const RefreshIcon: FC<SvgProps> = ({ color = '#fff', width = 32, height = 32 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M14.748 7.75a7 7 0 0 1-7 7c-3.864 0-6.223-3.892-6.223-3.892m0 0h3.164m-3.164 0v3.5M.748 7.75a6.985 6.985 0 0 1 7-7 8.611 8.611 0 0 1 7 3.892m0 0v-3.5m0 3.5h-3.106"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Svg>
  )
}

export default RefreshIcon
