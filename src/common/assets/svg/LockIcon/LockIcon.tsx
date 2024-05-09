import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

import { iconColors } from '@common/styles/themeConfig'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: ColorValue
}

const LockIcon: React.FC<Props> = ({ width = 18, height = 25, color = iconColors.primary }) => (
  <Svg width={width} height={height} viewBox="0 0 18 25">
    <G transform="translate(-7.25 -3.251)">
      <G transform="translate(8 4.001)">
        <G>
          <G transform="translate(5.019 10.119)">
            <Path
              d="M3.029,10.615v0L1.686,9.27V5.7A2.974,2.974,0,0,1,0,3,3,3,0,1,1,4.328,5.689v.32L3.8,6.533l.523.742L3.8,8.014l.8.885L3.029,10.613ZM2.994,1.072a.966.966,0,1,0,.967.963A.964.964,0,0,0,2.994,1.072Z"
              fill="none"
            />
          </G>
          <Path
            d="M-843.8,16858.977v-3a6,6,0,0,1,6-6,6,6,0,0,1,6,6v2.994l-4.586-1.482a5,5,0,0,0-1.421-.184,4.863,4.863,0,0,0-1.408.184l-4.585,1.488Z"
            transform="translate(845.8 -16849.979)"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <Path
            d="M10,2.184l-4.642,1.5A2.824,2.824,0,0,0,3.41,6.1v5.945a3.733,3.733,0,0,0,1.609,2.752l4,2.568a4.811,4.811,0,0,0,4.781,0l4-2.568a3.733,3.733,0,0,0,1.609-2.752V6.1A2.824,2.824,0,0,0,17.466,3.68l-4.642-1.5A5.467,5.467,0,0,0,10,2.184Z"
            transform="translate(-3.41 5.326)"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <G id="Group_2177" data-name="Group 2177" transform="translate(2.899 15.039) rotate(-45)">
            <Path
              d="M6.437,4.675a2.741,2.741,0,0,1-2.75.677l-1.7,1.7a.7.7,0,0,1-.539.177L.656,7.121a.683.683,0,0,1-.543-.543L0,5.79a.729.729,0,0,1,.177-.539l1.7-1.7A2.739,2.739,0,1,1,6.437,4.675Z"
              transform="translate(0)"
              fill="none"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <Path d="M0,0,.832.832" transform="translate(1.77 5.602)" fill="none" />
            <Path
              d="M.8,1.591A.8.8,0,1,0,0,.8.8.8,0,0,0,.8,1.591Z"
              transform="translate(3.728 1.915)"
              fill={color}
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)

export default React.memo(LockIcon)
