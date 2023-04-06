import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BinanceMonochromeIcon: React.FC<Props> = ({ width = 17.9, height = 17.9 }) => (
  <Svg width={width} height={height} viewBox="0 0 17.944 17.944">
    <G>
      <Path
        d="M14.463,12.452,8.972,17.944,3.481,12.452l2-2,3.49,3.49,3.49-3.49ZM8.972,6.961l2.011,2.011L8.972,10.983,6.961,8.972,8.972,6.961ZM2,10.974l-2-2,2-2,2,2Zm13.94-4,2,2-2,2-2-2,2-2ZM8.972,0l5.491,5.491-2,2L8.972,4l-3.49,3.49-2-2Z"
        transform="translate(0)"
        fill="#51588c"
      />
    </G>
  </Svg>
)

export default BinanceMonochromeIcon
