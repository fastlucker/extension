import React from 'react'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const BaseLogo: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" fill="none" {...rest}>
    <Rect x="1.25" y="1.25" width="29.5" height="29.5" rx="14.75" fill="#2151F5" />
    <Rect
      x="1.25"
      y="1.25"
      width="29.5"
      height="29.5"
      rx="14.75"
      stroke="#F5EDE2"
      strokeWidth="1.5"
    />
    <Path
      d="M16.0007 26C17.9453 25.9964 19.8469 25.4279 21.4733 24.3639C23.0998 23.2999 24.3808 21.7863 25.1602 20.0079C25.9396 18.2295 26.1836 16.263 25.8624 14.3485C25.5413 12.434 24.6689 10.6542 23.3516 9.2262C22.0344 7.79821 20.3293 6.7838 18.4443 6.30672C16.5593 5.82964 14.576 5.91052 12.7363 6.53949C10.8966 7.16846 9.28005 8.31833 8.08389 9.84881C6.88772 11.3793 6.16364 13.2242 6 15.1585H19.265V16.8415H6C6.21416 19.3413 7.36076 21.6697 9.21281 23.3658C11.0649 25.0618 13.4874 26.002 16.0007 26Z"
      fill="white"
    />
  </Svg>
)

export default React.memo(BaseLogo)
