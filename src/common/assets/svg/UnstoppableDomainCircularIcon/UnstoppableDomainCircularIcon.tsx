import React, { FC } from 'react'
import { G, Path, Rect, Svg, SvgProps } from 'react-native-svg'

const UnstoppableDomainCircularIcon: FC<SvgProps> = ({ width = 18, height = 18 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18">
      <Rect width="18" height="18" rx="9" fill="#4c47f7" />
      <G>
        <Path d="M15.319 3.121v4.51L2.357 12.883Z" fill="#2fe9ff" />
        <Path
          d="M8.819 14.73a4.067 4.067 0 0 1-2.284-.7 4.1 4.1 0 0 1-1.48-1.8 4.06 4.06 0 0 1-.322-1.582V7.456l2.461-1.358v4.569a1.416 1.416 0 1 0 2.832 0V4.534l2.879-1.586v7.7a4.067 4.067 0 0 1-.7 2.284 4.1 4.1 0 0 1-1.8 1.48 4.06 4.06 0 0 1-1.586.318Z"
          fill="#fff"
        />
      </G>
    </Svg>
  )
}

export default React.memo(UnstoppableDomainCircularIcon)
