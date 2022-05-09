import React from 'react'
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Stop,
  SvgProps
} from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
  color?: string
}

const Satellite: React.FC<Props> = ({ width = 152.5, height = 152.5, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 152.657 152.657" {...rest}>
    <Defs>
      <LinearGradient id="a" x1=".105" y1="1" x2="1" y2="1" gradientUnits="objectBoundingBox">
        <Stop offset="0" stopColor="#0f101e" stopOpacity=".722" />
        <Stop offset="1" stopColor="#0f101e" stopOpacity="0" />
      </LinearGradient>
      <LinearGradient id="b" x1=".891" x2=".268" y2=".909" gradientUnits="objectBoundingBox">
        <Stop offset="0" stopColor="#c8cae3" stopOpacity=".349" />
        <Stop offset="1" stopColor="#ebecff" stopOpacity=".388" />
      </LinearGradient>
    </Defs>
    <G>
      <Path
        d="M8057.32 12571.65h90.93v-16.95h-52.895Z"
        transform="translate(-8004.741 -12432.007)"
        fillRule="evenodd"
        fill="url(#a)"
      />
      <Circle cx="9.45" cy="9.45" r="9.45" transform="rotate(-45 181.598 -61.856)" fill="#51588c" />
      <Path
        d="M137.678 42.104c6.714 16.783-4.013 45.025-27.282 68.294-23.362 23.363-51.736 34.08-68.5 27.2l.571-2.724 93.688-92.06Z"
        fill="#969cc9"
        fillRule="evenodd"
      />
      <Ellipse
        cx="68.356"
        cy="24.054"
        rx="68.356"
        ry="24.054"
        transform="rotate(-45 154.196 32.801)"
        fill="#ebecff"
      />
      <Path
        d="M95.426 94.392 82.4 110s-6.8.408-8.888-4.671C79.45 100.432 88.7 93.992 88.7 93.992Z"
        fill="url(#b)"
      />
      <Path
        d="m39.005 39.005 29.333 24.908 29.335 24.908s-.5 3.865-2.713 6.078-6.139 2.774-6.139 2.774L63.913 68.338Z"
        fill="#d8d9eb"
        fillRule="evenodd"
      />
      <Path
        d="M26.718 26.717a3.3 3.3 0 1 1 0 4.664 3.3 3.3 0 0 1 0-4.664Zm0-19.044a21.521 21.521 0 0 1 17.537 6.172 21.521 21.521 0 0 1 6.171 17.536H47.46a18.557 18.557 0 0 0-18.412-20.889 18.434 18.434 0 0 0-2.331.146ZM10.639 26.717A18.549 18.549 0 0 0 31.381 47.46v2.967a22.139 22.139 0 0 1-2.332.125A21.51 21.51 0 0 1 7.674 26.718Zm16.079-11.365a13.9 13.9 0 0 1 16.029 16.029h-3a10.95 10.95 0 0 0-13.03-13.03Zm-8.366 11.365a10.953 10.953 0 0 0 13.029 13.031v3a13.9 13.9 0 0 1-16.029-16.03ZM26.718.093q1.165-.092 2.331-.094A29.049 29.049 0 0 1 58.1 29.049q0 1.167-.093 2.332H55.05q.105-1.165.105-2.332a26.107 26.107 0 0 0-26.106-26.1q-1.166 0-2.331.1ZM3.048 26.717c-.067.776-.1 1.555-.1 2.332a26.107 26.107 0 0 0 26.1 26.106q1.169 0 2.332-.105v2.957c-.775.061-1.554.094-2.332.094A29.051 29.051 0 0 1-.001 29.05q0-1.166.094-2.332Z"
        fill="#ebecff"
        fillRule="evenodd"
        opacity=".2"
      />
    </G>
    <G transform="translate(58.5 123.834)">
      <Circle cx="13.254" cy="13.254" r="13.254" fill="#fd1a64" />
      <Path
        d="m12.347 17.349-.836-8.572V4.814h3.488v3.963l-.824 8.572Zm-.7 4.336v-3.229h3.229v3.229Z"
        fill="#fff"
      />
    </G>
  </Svg>
)

export default Satellite
