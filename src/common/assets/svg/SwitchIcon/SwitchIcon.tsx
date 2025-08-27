import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import useTheme from '@common/hooks/useTheme'

const SwitchIcon: React.FC<SvgProps> = ({ width = 20, height = 20, color, ...rest }) => {
  const { theme } = useTheme()

  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" {...rest}>
      <G transform="translate(20) rotate(90)">
        <Rect width="20" height="20" transform="translate(20 0) rotate(90)" fill="none" />
        <G transform="translate(1.32 -1.27)">
          <Path
            d="M48.256,16.064l-3.59,3.59m0,0,3.59,3.59m-3.59-3.59h7.783a2.442,2.442,0,0,0,2.679-2.679"
            transform="translate(-37.768 -3.295)"
            fill="none"
            stroke={color || theme.primary}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <Path
            d="M48.256,16.064l-3.59,3.59m0,0,3.59,3.59m-3.59-3.59h7.783a2.442,2.442,0,0,0,2.679-2.679"
            transform="translate(55.128 25.834) rotate(180)"
            fill="none"
            stroke={color || theme.primary}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </G>
      </G>
    </Svg>
  )
}

export default React.memo(SwitchIcon)
