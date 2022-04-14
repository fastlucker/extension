import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const AvalancheMonochromeIcon: React.FC<Props> = ({ width = 17, height = 15.1 }) => (
  <Svg width={width} height={height} viewBox="0 0 17.019 15.124">
    <G>
      <Path
        d="M.1,14.067,7.823.372A.726.726,0,0,1,9.083.366L11.259,4.13a2.106,2.106,0,0,1,.014,2.083L6.931,13.965a2.272,2.272,0,0,1-1.982,1.162H.719A.711.711,0,0,1,.1,14.067ZM12.913,9.309,10.207,14a.754.754,0,0,0,.653,1.13h5.412A.754.754,0,0,0,16.924,14L14.218,9.309a.754.754,0,0,0-1.305,0Z"
        transform="translate(-0.007 -0.003)"
        fill="#51588c"
      />
    </G>
  </Svg>
)

export default AvalancheMonochromeIcon
