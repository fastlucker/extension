import React from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Mask, Rect } from 'react-native-svg'

const BackdropWithHole = ({
  x,
  y,
  width,
  height,
  bgColor,
  borderRadius
}: {
  x: number
  y: number
  width: number
  height: number
  bgColor: string
  borderRadius: number
}) => {
  const screenHeight = '100%'
  const screenWidth = '100%'

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg width={screenWidth} height={screenHeight}>
        {/* Define a mask with a transparent hole */}
        <Mask id="mask">
          <Rect
            x="0"
            y="0"
            width={screenWidth}
            height={screenHeight}
            rx={borderRadius}
            ry={borderRadius}
            lx={borderRadius}
            ly={borderRadius}
            fill="white"
          />
          <Rect x={x} y={y} width={width} height={height} fill="black" />
        </Mask>

        {/* Apply the mask to the semi-transparent backdrop */}
        <Rect
          x="0"
          y="0"
          width={screenWidth}
          height={screenHeight}
          fill={bgColor}
          mask="url(#mask)"
        />
      </Svg>
    </View>
  )
}

export default BackdropWithHole
