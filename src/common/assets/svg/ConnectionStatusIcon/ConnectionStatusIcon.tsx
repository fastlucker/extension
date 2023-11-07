import React from 'react'
import { ColorValue } from 'react-native'
import Svg, { Path, Rect, SvgProps } from 'react-native-svg'

import colors from '@common/styles/colors'

interface Props extends SvgProps {
  width?: number
  height?: number
  isActive?: boolean
  connectedColor?: string | ColorValue
  disconnectedColor?: string | ColorValue
  withRect?: boolean
}

const ConnectionStatusIcon: React.FC<Props> = ({
  width = 26,
  height = 26,
  isActive,
  connectedColor = colors.turquoise,
  disconnectedColor = colors.pink,
  withRect = true,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 26 26" {...rest}>
    {withRect && <Rect width={width} height={width} rx="8" fill={colors.martinique} />}
    {isActive ? (
      <Path
        d="M5183.536,22.8a1,1,0,0,1,0-1.415l1.485-1.484a5,5,0,0,1,.636-6.294l.708-.707-.354-.354a1,1,0,0,1,1.413-1.413l.354.354h0l-.353-.353a1,1,0,1,1,1.413-1.416l.354.355.708-.707a5,5,0,0,1,6.293-.637l1.485-1.485a1,1,0,1,1,1.415,1.415l-1.485,1.485a5,5,0,0,1-.636,6.292l-.708.709.355.354a1,1,0,1,1-1.415,1.413l-3.89-3.889,3.535,3.535h0l.354.354a1,1,0,1,1-1.415,1.413l-.354-.354-.707.707a5,5,0,0,1-6.292.637L5184.95,22.8a1,1,0,0,1-1.415,0Zm3.535-7.777a3,3,0,0,0-.023,4.219l.024.023.025.026a3,3,0,0,0,4.216-.026l.708-.707-4.242-4.242Zm4.243-4.242-.707.706,4.244,4.244.706-.707a3,3,0,0,0-4.242-4.242Z"
        transform="translate(-5178.643 -1.458)"
        fill={connectedColor}
      />
    ) : (
      <Path
        d="M5181.415,24.92a1,1,0,0,1,0-1.414l1.484-1.485a5,5,0,0,1,.636-6.294l.707-.707-.353-.353a1,1,0,0,1,1.414-1.414l7.779,7.778a1,1,0,0,1-1.414,1.415l-.354-.354-.707.707a5,5,0,0,1-6.293.637l-1.485,1.485a1,1,0,0,1-1.414,0Zm7.777-3.536.708-.706-4.243-4.243-.708.708a3,3,0,0,0-.024,4.217l.025.025.024.025A3,3,0,0,0,5189.192,21.385Zm3.536-4.95a1,1,0,0,1,0-1.414l2.121-2.121-1.414-1.414-2.121,2.121a1,1,0,0,1-1.414-1.415l2.121-2.12h0l-1.414-1.414h0l-.353-.353a1,1,0,1,1,1.414-1.414l.353.353.707-.707a5,5,0,0,1,6.293-.636l1.484-1.485a1,1,0,0,1,1.416,1.414l-1.485,1.485a5,5,0,0,1-.636,6.293l-.708.707.354.353a1,1,0,1,1-1.414,1.414l-.354-.354-1.415-1.414-2.121,2.121a1,1,0,0,1-1.414,0Zm1.414-8.485-.707.708,4.242,4.242.708-.708a3,3,0,0,0-4.243-4.242Z"
        transform="translate(-5178.643 -1.458)"
        fill={disconnectedColor}
      />
    )}
  </Svg>
)

export default ConnectionStatusIcon
