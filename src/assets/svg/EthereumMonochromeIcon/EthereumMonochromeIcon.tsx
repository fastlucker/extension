import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const EthereumMonochromeIcon: React.FC<Props> = ({ width = 11, height = 18 }) => (
  <Svg width={width} height={height} viewBox="0 0 11.054 17.943">
    <G>
      <G>
        <Path d="M5.538,0,0,9.138,5.538,12.4l5.5-3.252Z" fill="#62688f" />
        <Path d="M2922.09,0V12.4l5.5-3.252Z" transform="translate(-2916.552)" fill="#454a75" />
        <Path d="M5.538,0,0,9.138,5.538,6.627l5.5,2.524Z" fill="#8a92b2" />
        <Path d="M2922.09,0V6.627l5.5,2.524Z" transform="translate(-2916.552)" fill="#62688f" />
        <Path
          d="M13.2,5373.541l5.513,7.759,5.516-7.759-5.516,3.255Z"
          transform="translate(-13.175 -5363.356)"
          fill="#8a92b2"
        />
        <Path
          d="M2921.97,5381.3l5.516-7.759-5.516,3.255Z"
          transform="translate(-2916.432 -5363.356)"
          fill="#62688f"
        />
      </G>
    </G>
    <G opacity="0.8">
      <G>
        <Path d="M5.538,0,0,9.138,5.538,12.4l5.5-3.252Z" fill="#51588c" />
        <Path d="M2922.09,0V12.4l5.5-3.252Z" transform="translate(-2916.552)" fill="#51588c" />
        <Path d="M5.538,0,0,9.138,5.538,6.627l5.5,2.524Z" fill="#51588c" />
        <Path d="M2922.09,0V6.627l5.5,2.524Z" transform="translate(-2916.552)" fill="#51588c" />
        <Path
          d="M13.2,5373.541l5.513,7.759,5.516-7.759-5.516,3.255Z"
          transform="translate(-13.175 -5363.356)"
          fill="#51588c"
        />
        <Path
          d="M2921.97,5381.3l5.516-7.759-5.516,3.255Z"
          transform="translate(-2916.432 -5363.356)"
          fill="#51588c"
        />
      </G>
    </G>
  </Svg>
)

export default EthereumMonochromeIcon
