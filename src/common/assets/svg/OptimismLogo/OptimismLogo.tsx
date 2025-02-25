import React from 'react'
import Svg, { Circle, G, Path, Rect, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const OptimismLogo: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" {...rest}>
    <G>
      <Rect
        width={32}
        height={32}
        rx={6}
        transform="translate(0 32) rotate(-90)"
        fill="rgba(103,112,179,0.2)"
        opacity={0}
      />
      <G transform="translate(24044 11225)">
        <Path
          d="M0,10A10,10,0,1,1,10,20,10,10,0,0,1,0,10Z"
          transform="translate(-24038 -11219)"
          fill="#fff"
        />
        <Path
          d="M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Zm0,15.092v4.176A7.179,7.179,0,0,1,10,4.908V.733a7.179,7.179,0,1,1,0,14.359Zm3.443-5.124v.064a7.407,7.407,0,0,0-3.411,3.411H9.968a7.408,7.408,0,0,0-3.411-3.411V9.968A7.407,7.407,0,0,0,9.968,6.557h.064A7.407,7.407,0,0,0,13.443,9.968Z"
          transform="translate(-24038 -11219)"
          fill="#ff0420"
        />
      </G>
    </G>
  </Svg>
)

export default OptimismLogo
