import React from 'react'
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'

type Props = {
  width?: number
  height?: number
}

const AmbireNotDefaultWalletLogo: React.FC<any> = ({ width = 17, height = 24 }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 17.2 24">
    <Defs>
      <LinearGradient
        id="linear-gradient"
        x1="0.554"
        y1="0.58"
        x2="0.052"
        y2="0.409"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#6000ff" />
        <Stop offset="0.651" stopColor="#4900c3" />
        <Stop offset="1" stopColor="#320086" />
      </LinearGradient>
      <LinearGradient
        id="linear-gradient-2"
        x1="0.06"
        y1="-0.087"
        x2="0.486"
        y2="0.653"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#6a0aff" />
        <Stop offset="0.047" stopColor="#8c2dff" />
        <Stop offset="0.102" stopColor="#6a0aff" />
        <Stop offset="0.902" stopColor="#af50ff" />
        <Stop offset="1" stopColor="#af50ff" />
      </LinearGradient>
      <LinearGradient
        id="linear-gradient-3"
        x1="1.071"
        y1="0.062"
        x2="0.095"
        y2="1.049"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#6a0aff" />
        <Stop offset="0.51" stopColor="#8c2dff" />
        <Stop offset="0.969" stopColor="#af50ff" />
        <Stop offset="1" stopColor="#af50ff" />
      </LinearGradient>
      <LinearGradient
        id="linear-gradient-4"
        x1="0.448"
        y1="0.297"
        x2="0.538"
        y2="0.8"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#6000ff" />
        <Stop offset="1" stopColor="#3e00a5" />
      </LinearGradient>
      <LinearGradient
        id="linear-gradient-5"
        x1="-0.529"
        y1="1.069"
        x2="1.092"
        y2="0.86"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#ae60ff" />
        <Stop offset="0.322" stopColor="#af50ff" />
        <Stop offset="1" stopColor="#6000ff" />
      </LinearGradient>
      <LinearGradient
        id="linear-gradient-6"
        x1="-0.111"
        y1="0.274"
        x2="0.872"
        y2="1.224"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#6f0fff" />
        <Stop offset="0.702" stopColor="#af50ff" />
        <Stop offset="1" stopColor="#af50ff" />
      </LinearGradient>
      <LinearGradient
        id="linear-gradient-7"
        x1="0.015"
        y1="0.007"
        x2="0.985"
        y2="0.95"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#ae60ff" />
        <Stop offset="0.031" stopColor="#b670fa" />
        <Stop offset="1" stopColor="#be80f5" />
      </LinearGradient>
    </Defs>
    <G id="logo" transform="translate(-1138.311 -644.892)">
      <G id="ambire" transform="translate(1138.311 644.892)">
        <Path
          d="M523.667,626.589l3.154,6.7a.19.19,0,0,1-.039.209l-8.3,8a.092.092,0,0,1-.155-.07v-7.354l5.228-5.04a.169.169,0,0,0,.055-.132l.015-2.323c0-.015.031-.015.039,0Z"
          transform="translate(-510.837 -617.532)"
          fill="#6000ff"
        />
        <Path
          d="M518.34,800.7v7.354a.092.092,0,0,0,.155.07h0l8.3-8a.19.19,0,0,0,.039-.209h0l-3.239-4.275Z"
          transform="translate(-510.847 -784.145)"
          fillRule="evenodd"
          fill="url(#linear-gradient)"
        />
        <Path
          d="M881.674,626.01h0a.018.018,0,0,0-.018.019h0l-.013,2.322a.191.191,0,0,1-.031.108l3.252,4.382a.2.2,0,0,0-.016-.116h0l-3.154-6.7a.022.022,0,0,0-.019-.011h0Z"
          transform="translate(-868.865 -616.973)"
          fillRule="evenodd"
          fill="url(#linear-gradient-2)"
        />
        <Path
          d="M894.215,812.628a.2.2,0,0,0-.016-.116h0l-.163-.348L891.1,808.43l3.115,4.2Z"
          transform="translate(-878.218 -796.76)"
          fill="#be80f5"
          fillRule="evenodd"
        />
        <Path
          d="M39.349,235.509l-1.484,4.2a.194.194,0,0,0,.008.147l1.383,2.717-3.807,2.152a.1.1,0,0,1-.132-.039l-.823-1.711a.164.164,0,0,1,.016-.178l4.8-7.308a.024.024,0,0,1,.039.023Z"
          transform="translate(-33.976 -232.08)"
          fill="#6000ff"
        />
        <Path
          d="M55.317,235.46h0a.02.02,0,0,0-.015.006h0l-4.6,7-.005.009,3.156-2.786.01-.028h0v0l1.473-4.166a.023.023,0,0,0-.023-.029Z"
          transform="translate(-49.967 -232.061)"
          fillRule="evenodd"
          fill="url(#linear-gradient-3)"
        />
        <Path
          d="M34.5,531.269a.165.165,0,0,0-.015.178h0l.823,1.711a.1.1,0,0,0,.132.039h0l3.806-2.152-1.383-2.717a.193.193,0,0,1-.008-.147Z"
          transform="translate(-33.966 -520.555)"
          fillRule="evenodd"
          fill="url(#linear-gradient-4)"
        />
        <Path
          d="M7.507.028V6.554a.186.186,0,0,1-.039.108h0L.049,16.7a.179.179,0,0,0,.023.24h0l5.2,5.016a.089.089,0,0,0,.148-.031h0L11.08,8.714a.213.213,0,0,0,0-.139h0L7.576.013A.033.033,0,0,0,7.545-.01h0a.038.038,0,0,0-.038.038Z"
          transform="translate(-0.013 0.01)"
          fillRule="evenodd"
          fill="url(#linear-gradient-5)"
        />
        <Path
          d="M517.706,0h0a.038.038,0,0,0-.038.038l0,6.526a.18.18,0,0,1-.01.054L521.2,8.478,517.737.023A.033.033,0,0,0,517.706,0Zm-.046,6.618.675.387Z"
          transform="translate(-510.177 0)"
          fillRule="evenodd"
          fill="url(#linear-gradient-6)"
        />
        <Path
          d="M521.265,460.5h0a.206.206,0,0,0-.011-.068h0l-.045-.111-3.539-1.859.678.387Z"
          transform="translate(-510.187 -451.842)"
          fillRule="evenodd"
          fill="url(#linear-gradient-7)"
        />
        <Path
          d="M37.225,530.958l-.2.3,3.353-3.085Z"
          transform="translate(-36.495 -520.545)"
          fill="#be80f5"
        />
      </G>
      <G
        transform="translate(1146.642 659.892)"
        fill="#cacde6"
        stroke="#f6f0ff"
        strokeWidth="1.2"
        opacity="0"
      >
        <Circle cx="3.834" cy="3.834" r="3.834" stroke="none" />
        <Circle cx="3.834" cy="3.834" r="4.434" fill="none" />
      </G>
      <G transform="translate(1146.642 659.892)" fill="#f6851b" stroke="#fcf0ed" strokeWidth="1.2">
        <Circle cx="3.834" cy="3.834" r="3.834" stroke="none" />
        <Circle cx="3.834" cy="3.834" r="4.434" fill="none" />
      </G>
    </G>
  </Svg>
)

export default React.memo(AmbireNotDefaultWalletLogo)
