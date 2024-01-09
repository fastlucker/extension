import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const ImportAccountIcon: React.FC<Props> = ({
  width = 54,
  height = 54,
  color = colors.martinique,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 54.604 54.73" {...rest}>
    <G fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <G>
        <Path d="M24.898 32.838a7.1 7.1 0 1 0-7.1-7.1 7.1 7.1 0 0 0 7.1 7.1Z" />
        <Path d="M38.011 49.183c0-5.886-5.861-10.687-13.112-10.687s-13.112 4.776-13.112 10.687" />
        <Path d="M48.999 29.73A23.924 23.924 0 1 1 34.348 7.599a10.241 10.241 0 0 0-.505 3.183 9.9 9.9 0 0 0 1.465 5.2 9.306 9.306 0 0 0 1.92 2.3 9.9 9.9 0 0 0 6.72 2.6 9.312 9.312 0 0 0 3.158-.531 24.164 24.164 0 0 1 1.893 9.379Z" />
      </G>
      <G>
        <Path d="M53.603 10.9a8.9 8.9 0 0 1-.3 2.3 9.245 9.245 0 0 1-1.135 2.8 9.651 9.651 0 0 1-5.372 4.286 9.125 9.125 0 0 1-3.095.52 9.707 9.707 0 0 1-6.585-2.55A9.12 9.12 0 0 1 35.233 16a9.707 9.707 0 0 1-1.437-5.1 10.036 10.036 0 0 1 .5-3.119A9.766 9.766 0 0 1 36.596 4a9.89 9.89 0 0 1 7.1-3 9.764 9.764 0 0 1 7.353 3.293 9.864 9.864 0 0 1 2.554 6.607Z" />
        <Path d="M47.39 10.855h-7.378" />
        <Path d="M43.7 7.24v7.4" />
      </G>
    </G>
  </Svg>
)

export default ImportAccountIcon
