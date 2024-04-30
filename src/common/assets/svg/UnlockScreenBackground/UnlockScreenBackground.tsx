import './unlock-screen-background.css'

import React from 'react'
import Svg, { ClipPath, Defs, Ellipse, G, Path, Stop, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const UnlockScreenBackground: React.FC<Props> = ({ width = 600, height = 360, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 600 360" {...rest}>
    <Defs>
      <linearGradient id="linear-gradient" x1="1" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <Stop offset="0" stopColor="#353d6e" />
        <Stop offset="1" stopColor="#6000ff" />
      </linearGradient>
      <ClipPath id="clip-path">
        <Path
          d="M0,0H600a0,0,0,0,1,0,0V354a6,6,0,0,1-6,6H6a6,6,0,0,1-6-6V0A0,0,0,0,1,0,0Z"
          transform="translate(799 76)"
          fill="url(#linear-gradient)"
        />
      </ClipPath>
    </Defs>
    <G id="bg" transform="translate(-799 -76)" clipPath="url(#clip-path)">
      <Path
        d="M0,0H600a0,0,0,0,1,0,0V354a6,6,0,0,1-6,6H6a6,6,0,0,1-6-6V0A0,0,0,0,1,0,0Z"
        transform="translate(799 76)"
        fill="url(#linear-gradient)"
      />
      <Ellipse
        cx="157.5"
        cy="187.834"
        rx="157.5"
        ry="187.834"
        transform="translate(715 -42.984)"
        fill="#8b3dff"
        nativeID="unlock-screen-background"
      />
      <Ellipse
        cx="175.5"
        cy="221.925"
        rx="175.5"
        ry="221.925"
        transform="translate(1217 128.139)"
        fill="#56f6c1"
        nativeID="unlock-screen-background"
      />
    </G>
  </Svg>
)

export default React.memo(UnlockScreenBackground)
