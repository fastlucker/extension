import React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  isFilled?: boolean
}

const ScanIcon: React.FC<Props> = ({ width = 24, height = 24, isFilled = true }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Defs>
      <ClipPath id="clip-path">
        <Path
          d="M1991,27V17h10V27Zm-14,0V17h10V27Zm14-14V3h10V13Zm-14,0V3h10V13Z"
          transform="translate(-1815 528)"
          fill={colors.titan}
        />
      </ClipPath>
    </Defs>
    <Rect width="24" height="24" transform="translate(0 0)" fill="none" />
    {!!isFilled && (
      <>
        <Path
          id="Path_44"
          d="M2,2v8h8V2H2M2,0h8a2,2,0,0,1,2,2v8a2,2,0,0,1-2,2H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0Z"
          transform="translate(6 6)"
          fill={colors.titan}
        />
        <Rect width="4" height="4" rx="2" transform="translate(10 10)" fill={colors.titan} />
      </>
    )}
    <G transform="translate(-162 -531)" clipPath="url(#clip-path)">
      <Path
        d="M4,2A2,2,0,0,0,2,4V18a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V4a2,2,0,0,0-2-2H4M4,0H18a4,4,0,0,1,4,4V18a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z"
        transform="translate(163 532)"
        fill={colors.titan}
      />
    </G>
  </Svg>
)

export default ScanIcon
