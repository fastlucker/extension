import React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const FantomMonochromeIcon: React.FC<Props> = ({ width = 10.7, height = 17.9, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 10.694 17.891" {...rest}>
    <Path
      d="m5.616.155 5.078 2.93V14.8l-5.347 3.09L0 14.8V3.086L5.347 0l.269.155Zm.274 6.954v3.672l3.178-1.836L5.89 7.109ZM4.8 10.781V7.109L1.626 8.945 4.8 10.781Zm4.8-.9-4.253 2.462-4.261-2.459v4.3l4.261 2.461 4.261-2.461Zm-3.172-3.71 3.18 1.835V4.337l-3.18 1.834ZM1.086 8.006l3.18-1.835-3.18-1.834v3.67Zm.54-4.606 3.721 2.15L9.068 3.4 5.347 1.248 1.626 3.4Z"
      fill="#51588c"
    />
  </Svg>
)

export default FantomMonochromeIcon
