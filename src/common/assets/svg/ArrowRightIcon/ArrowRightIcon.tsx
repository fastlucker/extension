import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

const ArrowRightIcon: React.FC<SvgProps> = ({ width = 32, height = 32, color, ...props }) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" {...props}>
      <G id="arrow" transform="translate(-1225 976) rotate(-90)">
        <Rect
          id="Rectangle_1378"
          data-name="Rectangle 1378"
          width={width}
          height={height}
          rx={16}
          transform="translate(944 1225)"
          fill="#fff"
        />
        <G id="arrow-2" data-name="arrow" transform="translate(970 1231) rotate(90)">
          <Rect
            id="Boundary"
            width={20}
            height={20}
            transform="translate(20 0) rotate(90)"
            fill="none"
          />
          <G id="swap_icon" data-name="swap icon" transform="translate(4.358 4.07)">
            <Path
              id="Path_18060"
              data-name="Path 18060"
              d="M4,0,0,4M0,4,4,8M0,4H10.037"
              transform="translate(10.679 9.93) rotate(180)"
              fill="none"
              stroke={color || '#000'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />
          </G>
        </G>
      </G>
    </Svg>
  )
}

export default React.memo(ArrowRightIcon)
