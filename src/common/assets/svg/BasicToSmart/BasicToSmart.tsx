import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BasicToSmart: React.FC<Props> = ({ width = 61, height = 61, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 61 61" {...rest}>
    <G transform="translate(19059 -1993.306)">
      <Rect
        width="61"
        height="61"
        rx="6"
        transform="translate(-19059 1993.306)"
        fill="#54597a"
        opacity="0"
      />
      <G transform="translate(-19038.965 2020.52)">
        <G transform="translate(0 0)">
          <Path
            d="M15.74,16h-.421a5.476,5.476,0,1,1,5.671-5.474A5.4,5.4,0,0,1,15.74,16Z"
            transform="translate(-5.022 -5.05)"
            fill="#e7e9fb"
          />
          <Path
            d="M11.054,13.315c-3.734,2.5-3.734,6.569,0,9.067a15.076,15.076,0,0,0,15.44,0c3.734-2.5,3.734-6.569,0-9.067A15.206,15.206,0,0,0,11.054,13.315Z"
            transform="translate(-8.254 2.296)"
            fill="#e7e9fb"
          />
        </G>
      </G>
      <Path
        d="M15.04,3.308a1,1,0,0,1,1.921,0l2.486,8.564a1,1,0,0,0,.682.682l8.564,2.486a1,1,0,0,1,0,1.921l-8.564,2.486a1,1,0,0,0-.682.682L16.96,28.692a1,1,0,0,1-1.921,0l-2.486-8.564a1,1,0,0,0-.682-.682L3.308,16.96a1,1,0,0,1,0-1.921l8.564-2.486a1,1,0,0,0,.682-.682Z"
        transform="translate(-19030 1993.306)"
        fill="#e7e9fb"
      />
      <Path
        d="M11.467,3.308a1,1,0,0,1,1.921,0L15.07,9.1a1,1,0,0,0,.682.682l5.795,1.682a1,1,0,0,1,0,1.921L15.751,15.07a1,1,0,0,0-.682.682l-1.682,5.795a1,1,0,0,1-1.921,0L9.784,15.751A1,1,0,0,0,9.1,15.07L3.308,13.387a1,1,0,0,1,0-1.921L9.1,9.784A1,1,0,0,0,9.784,9.1Z"
        transform="translate(-19059 2012.209)"
        fill="#e7e9fb"
      />
    </G>
  </Svg>
)

export default BasicToSmart
