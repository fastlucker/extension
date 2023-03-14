import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const GnosisMonochromeIcon: React.FC<Props> = ({ width = 17.9, height = 17.9, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 17.891 17.89" {...rest}>
    <Path
      d="M5.258 10.186a2.328 2.328 0 0 0 1.421-.485l-3.26-3.26a2.329 2.329 0 0 0 .418 3.265 2.359 2.359 0 0 0 1.421.481Z"
      fill="#51588c"
    />
    <Path
      d="M14.956 7.858a2.328 2.328 0 0 0-.485-1.421l-3.26 3.26a2.324 2.324 0 0 0 3.745-1.839Z"
      fill="#51588c"
    />
    <Path
      d="m16.6 4.309-1.442 1.442a3.285 3.285 0 0 1-4.627 4.627l-1.584 1.584-1.58-1.58A3.285 3.285 0 0 1 2.74 5.755L2 5.015l-.7-.706a8.943 8.943 0 1 0 15.3 0Z"
      fill="#51588c"
    />
    <Path
      d="M15.416 2.771a8.941 8.941 0 0 0-12.64-.3q-.157.15-.3.3a9.486 9.486 0 0 0-.627.732l7.1 7.1 7.1-7.1a8.643 8.643 0 0 0-.633-.732ZM8.948 1.17a7.688 7.688 0 0 1 5.5 2.278l-5.5 5.5-5.5-5.5a7.688 7.688 0 0 1 5.5-2.278Z"
      fill="#51588c"
    />
  </Svg>
)

export default GnosisMonochromeIcon
