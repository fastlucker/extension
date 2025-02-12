import React from 'react'
import Svg, { Circle, G, Path, Rect, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const PayGas: React.FC<Props> = ({ width = 50, height = 38, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 50.524 38.622" {...rest}>
    <G transform="translate(-361.417 -428.689)">
      <Circle
        cx="4.444"
        cy="4.444"
        r="4.444"
        transform="translate(370.112 438.033)"
        fill="#cacde6"
      />
      <Circle
        cx="4.444"
        cy="4.444"
        r="4.444"
        transform="translate(361.417 446.112)"
        fill="#cacde6"
      />
      <G transform="translate(376.559 429.189)">
        <Path
          d="M1.7,37.622A1.7,1.7,0,0,1,0,35.92V34.828a1.7,1.7,0,0,1,1.7-1.7H22.6a1.7,1.7,0,0,1,1.7,1.7V35.92a1.7,1.7,0,0,1-1.7,1.7ZM1.891,31.2V2.363A2.353,2.353,0,0,1,2.584.693,2.353,2.353,0,0,1,4.254,0H20.137a2.36,2.36,0,0,1,2.177,1.444,2.355,2.355,0,0,1,.186.919c-.047,17.792.109,19.391,0,28.837ZM6.265,6.343v6.714A1.137,1.137,0,0,0,7.4,14.192h9.356a1.137,1.137,0,0,0,1.134-1.134V6.343a1.137,1.137,0,0,0-1.134-1.134H7.4A1.137,1.137,0,0,0,6.265,6.343Z"
          transform="translate(0 0)"
          fill="none"
          stroke="#8b3dff"
          strokeWidth="1"
        />
        <Path
          d="M7.212,21.112h.639a3.54,3.54,0,0,1,2.5,1.038,3.5,3.5,0,0,1,1.038,2.5V28.18a1.861,1.861,0,0,0,3.722-.015v-8.05H13.1a.838.838,0,0,1-.838-.838V10.843a.846.846,0,0,1,.48-.761l5.177-2.422V5.776L12.714,3.1a.838.838,0,0,1,.764-1.492l5.661,2.914a.834.834,0,0,1,.454.742V19.277a.84.84,0,0,1-.838.838H16.972v8.05a3.7,3.7,0,0,1-1.089,2.629,3.727,3.727,0,0,1-6.063-1.182,3.749,3.749,0,0,1-.284-1.171H9.527V24.834a1.865,1.865,0,0,0-1.861-1.861H7.212Z"
          transform="translate(15.289 0.092)"
          fill="none"
          stroke="#8b3dff"
          strokeWidth="1"
        />
        <Rect width="14" height="11" rx="2" transform="translate(5.441 3.811)" fill="#cacde6" />
      </G>
      <Circle
        cx="4.444"
        cy="4.444"
        r="4.444"
        transform="translate(373.649 452.145)"
        fill="#cacde6"
      />
    </G>
  </Svg>
)

export default PayGas
