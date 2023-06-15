import React from 'react'
import Svg, { G, Path, Line } from 'react-native-svg'

const InformationIcon: React.FC<any> = ({ ...props }) => (
  <Svg width="119.6" height="119.6" {...props}>
    <G transform="translate(-60 -60)" opacity="0.15">
      <Path
        d="M119.8,64a55.8,55.8,0,1,0,55.8,55.8A55.8,55.8,0,0,0,119.8,64Z"
        fill="none"
        stroke="#dddff7"
        strokeWidth="8"
      />
      <Path
        d="M220,220h9.7v35.178"
        transform="translate(-108.691 -108.691)"
        fill="none"
        stroke="#dddff7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <Line
        x2="26"
        transform="translate(108 148)"
        fill="none"
        stroke="#dddff7"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <Path
        d="M229.885,130a7.885,7.885,0,1,0,7.885,7.885A7.885,7.885,0,0,0,229.885,130Z"
        transform="translate(-110.085 -45.985)"
        fill="#dddff7"
      />
    </G>
  </Svg>
)

export default InformationIcon
