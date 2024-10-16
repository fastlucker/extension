import React from 'react'
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg'

type Props = {
  width?: number | string
  height?: number | string
}

const AmbireLogoWithTextMonochrome = ({ width = 160, height = 168, ...rest }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 160.616 168" {...rest}>
    <Defs>
      <LinearGradient
        id="monochrome-linear-gradient"
        x1="0.554"
        y1="0.58"
        x2="0.052"
        y2="0.409"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#fff" />
        <Stop offset="0.562" stopColor="#cacde6" />
        <Stop offset="1" stopColor="#54597a" />
      </LinearGradient>
      <LinearGradient
        id="monochrome-linear-gradient-2"
        x1="0.06"
        y1="-0.087"
        x2="0.486"
        y2="0.653"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#e7e9fb" />
        <Stop offset="1" stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="monochrome-linear-gradient-3"
        x1="1.071"
        y1="0.062"
        x2="0.095"
        y2="1.049"
      />
      <LinearGradient
        id="monochrome-linear-gradient-4"
        x1="0.448"
        y1="0.297"
        x2="0.538"
        y2="0.8"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#e7e9fb" />
        <Stop offset="1" stopColor="#54597a" />
      </LinearGradient>
      <LinearGradient
        id="monochrome-linear-gradient-5"
        x1="-0.529"
        y1="1.069"
        x2="1.092"
        y2="0.86"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#fff" />
        <Stop offset="0.322" stopColor="#fff" />
        <Stop offset="1" stopColor="#cacde6" />
      </LinearGradient>
      <LinearGradient
        id="monochrome-linear-gradient-6"
        x1="-0.111"
        y1="0.274"
        x2="0.872"
        y2="1.224"
        gradientUnits="objectBoundingBox"
      >
        <Stop offset="0" stopColor="#cacde6" />
        <Stop offset="1" stopColor="#f2f3fa" />
      </LinearGradient>
    </Defs>
    <G id="logo" transform="translate(0 0)">
      <Path
        id="Wallet"
        d="M1323.374,1218.92h-3.184l-6.18-16.08h4.218l3.9,10.8,4.3-10.8h3.559l4.336,10.763,3.9-10.763h4.177l-6.2,16.08H1332.6l-4.448-10.96-4.448,10.96Zm37.066,0h-3.51l-1.9-3.6h-8.579l-1.9,3.6h-4.237q4.329-8.04,8.66-16.08h3.609q4.337,8.044,8.684,16.08Zm-9.7-11.716-2.576,4.856h5.134Zm26.317,11.716h-13.621v-16.08h3.95v12.734h10.17v3.346Zm17.115,0h-13.62v-16.08h3.949v12.734h10.17v3.346Zm18.386,0h-14.892v-16.08h15.239v3.282h-11.355v2.966H1411.7v3.261h-10.148v3.289h11.506v3.282h-.5Zm12.5,0h-3.451v-12.734h-6.851v-3.347h17.7v3.347h-6.895v12.734h-.5Z"
        transform="translate(-1292.738 -1050.92)"
        fill="#fff"
      />
      <Path
        id="Ambire"
        d="M1337.28,811.221l-2.657-5.042H1322.6l-2.657,5.042h-5.938q6.066-11.266,12.134-22.531h5.059l12.167,22.531h-6.09Zm-8.667-16.412-3.606,6.8h7.188l-3.584-6.8Zm17.787,16.412V788.69h5.465l9.632,13.474,9.545-13.474h5.435v22.531h-5.264V796.742l-7.6,10.886H1359.3l-7.635-10.762v14.355Zm52.813,0h-16.065V788.69h15.613a9,9,0,0,1,5.546,1.578,5.434,5.434,0,0,1,2.127,4.5,5.486,5.486,0,0,1-2.511,4.727,6.318,6.318,0,0,1,2.087,1.534,5.551,5.551,0,0,1,1.359,3.761,5.757,5.757,0,0,1-2.228,4.787A9.6,9.6,0,0,1,1399.213,811.221Zm1.075-17.5a3.688,3.688,0,0,0-2.282-.586h-9.413v4.456h9.443a3.445,3.445,0,0,0,2.21-.643,2.042,2.042,0,0,0,.711-1.646,1.9,1.9,0,0,0-.67-1.581Zm.659,9.008a4.17,4.17,0,0,0-2.549-.659h-9.805v4.7h9.9a4.139,4.139,0,0,0,2.5-.613,1.98,1.98,0,0,0,.72-1.675A2.092,2.092,0,0,0,1400.947,802.733Zm11.522,8.488V788.69h5.536v22.531Zm12.207,0V788.69h14.616a9.168,9.168,0,0,1,6.135,1.91,6.868,6.868,0,0,1,2.262,5.432,6.714,6.714,0,0,1-2.006,5.046,7.855,7.855,0,0,1-4.049,1.936l7.622,8.208h-7.07l-7.154-7.758h-4.821v7.758h-5.536Zm16.656-17.2a4.272,4.272,0,0,0-2.735-.727h-8.386v5.574h8.386a4.269,4.269,0,0,0,2.723-.733,2.488,2.488,0,0,0,.833-2.039,2.54,2.54,0,0,0-.822-2.075Zm11.73,17.2V788.69h21.565v4.6h-16.12v4.154h14.218v4.57h-14.218v4.608h16.12v4.6h-21.565Z"
        transform="translate(-1314.01 -666.821)"
        fill="#fff"
        fillRule="evenodd"
      />
      <G id="symbol" transform="translate(46.497 0)">
        <G id="right" transform="translate(32.344 39.064)">
          <Path
            d="M541.366,626.628l13.614,28.979a.82.82,0,0,1-.168.9L519,691.111a.4.4,0,0,1-.671-.3V659.02L540.9,637.235a.732.732,0,0,0,.235-.569l.067-10.039c0-.067.134-.067.168,0Z"
            transform="translate(-518.33 -626.543)"
            fill="#fff"
          />
          <Path
            d="M518.34,817.523v31.79a.4.4,0,0,0,.671.3h0l35.811-34.6a.82.82,0,0,0,.168-.9h0l-13.982-18.48Z"
            transform="translate(-518.34 -785.046)"
            fillRule="evenodd"
            fill="url(#monochrome-linear-gradient)"
          />
          <Path
            d="M881.885,626.01h-.005a.077.077,0,0,0-.081.081h0l-.057,10.037a.829.829,0,0,1-.132.467l14.036,18.943a.872.872,0,0,0-.067-.5h0l-13.614-28.979a.094.094,0,0,0-.082-.047h0Z"
            transform="translate(-858.942 -626.01)"
            fillRule="evenodd"
            fill="url(#monochrome-linear-gradient-2)"
          />
          <Path
            d="M904.544,826.574a.872.872,0,0,0-.067-.5h0l-.7-1.505L891.1,808.43l13.444,18.144Z"
            transform="translate(-867.84 -797.047)"
            fill="#fff"
            fillRule="evenodd"
          />
        </G>
        <G id="left" transform="translate(2.15 14.694)">
          <Path
            d="M55.513,235.606l-6.4,18.137a.841.841,0,0,0,.034.636l5.968,11.745-16.43,9.3a.431.431,0,0,1-.57-.167l-3.554-7.4a.711.711,0,0,1,.067-.769l20.722-31.589a.1.1,0,0,1,.168.1Z"
            transform="translate(-34.474 -235.478)"
            fill="#fff"
          />
          <Path
            d="M70.628,235.461h-.006a.089.089,0,0,0-.063.027h0L50.722,265.727l-.022.04,13.622-12.042.043-.122h0l0-.009,6.358-18.006a.1.1,0,0,0-.1-.127Z"
            transform="translate(-49.687 -235.46)"
            fillRule="evenodd"
            fill="url(#monochrome-linear-gradient-3)"
          />
          <Path
            d="M34.613,541.531a.713.713,0,0,0-.067.77h0l3.554,7.4a.43.43,0,0,0,.57.166h0l16.43-9.3-5.969-11.745a.835.835,0,0,1-.034-.636Z"
            transform="translate(-34.464 -509.914)"
            fillRule="evenodd"
            fill="url(#monochrome-linear-gradient-4)"
          />
          <Path
            d="M37.874,540.22l-.844,1.286L51.5,528.17Z"
            transform="translate(-36.87 -509.905)"
            fill="#fff"
          />
        </G>
        <G id="center" transform="translate(0)">
          <Path
            d="M32.357.154v28.21a.8.8,0,0,1-.167.469h0L.167,72.234a.776.776,0,0,0,.1,1.038h0L22.733,94.955a.385.385,0,0,0,.637-.134h0L47.781,37.7a.922.922,0,0,0,0-.6h0L32.658.087a.144.144,0,0,0-.137-.1h0a.165.165,0,0,0-.165.163Z"
            transform="translate(-0.013 0.01)"
            fillRule="evenodd"
            fill="url(#monochrome-linear-gradient-5)"
          />
          <Path
            id="Path_3163"
            d="M517.86,0h0a.165.165,0,0,0-.165.163l.01,28.21a.783.783,0,0,1-.042.235l15.266,8.038L517.993.1a.144.144,0,0,0-.134-.1Zm-.2,28.608,2.915,1.673Z"
            transform="translate(-485.358 0)"
            fillRule="evenodd"
            fill="url(#monochrome-linear-gradient-6)"
          />
          <Path
            d="M533.189,467.273v0a.915.915,0,0,0-.047-.293h0l-.194-.478L517.67,458.46l2.926,1.673Z"
            transform="translate(-485.368 -429.851)"
            fill="#fff"
            fillRule="evenodd"
          />
        </G>
      </G>
    </G>
  </Svg>
)

export default React.memo(AmbireLogoWithTextMonochrome)
