import React from 'react'
import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const LatticeIcon: React.FC<Props> = ({ width = 122, height = 41 }) => (
  <Svg width={width} height={height} viewBox="0 0 121.954 41.44">
    <G transform="translate(0)">
      <Path
        d="M520.315,47.568h-7.521v-7.4h-6.284v7.4H498.99v5.924h7.521v7.4h6.284v-7.4h7.521Z"
        transform="translate(-398.361 -40.17)"
        fill={iconColors.primary}
      />
      <Path
        d="M89.531,99.355a14.1,14.1,0,0,1-6.119,1.269c-6.265,0-11.34-4.518-11.34-11.106S76.917,78.6,83.458,78.6a14.6,14.6,0,0,1,8.189,2.258l2.87-5.177c-1.223-.8-4.706-3.151-11.34-3.151-10.442,0-17.838,7.426-17.838,16.988s7.388,16.94,17.7,16.94c6.917,0,10.825-2.495,12.612-3.859V89.565H89.531Z"
        transform="translate(-65.34 -65.021)"
        fill={iconColors.primary}
      />
      <Path
        d="M250.489,84.3c0-7.6-5.523-12.3-13.8-12.3H224.53v34.053h6.683V96.319h5.862l6.634,9.734h7.89l-7.8-11.236A11.118,11.118,0,0,0,250.489,84.3ZM236.1,90.45h-4.889V77.869h4.94c4.409,0,7.409,2.372,7.409,6.439,0,3.729-2.954,6.152-7.458,6.152Z"
        transform="translate(-187.59 -64.614)"
        fill={iconColors.primary}
      />
      <Rect
        width="6.683"
        height="34.046"
        transform="translate(69.849 7.393)"
        fill={iconColors.primary}
      />
      <Path
        d="M458.466,89.316h0V88.292h-6.233v1.023s-.067,2.478-.176,3.3c-.638,4.762-5.158,7.535-10.932,7.535h-6.152V77.915h6.184V72H428.29v34.053h13.125c9.43,0,16.306-5.154,17.051-13.443C458.54,91.792,458.466,89.316,458.466,89.316Z"
        transform="translate(-344.067 -64.614)"
        fill={iconColors.primary}
      />
    </G>
  </Svg>
)

export default LatticeIcon
