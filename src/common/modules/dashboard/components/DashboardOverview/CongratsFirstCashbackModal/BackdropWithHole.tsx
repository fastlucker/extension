import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Svg, { Defs, G, Mask, Path, Rect } from 'react-native-svg'

const BackdropWithHole = ({
  x,
  y,
  width,
  height,
  bgColor,
  borderColor,
  borderWidth,
  borderRadius
}: {
  x: number
  y: number
  width: number
  height: number
  bgColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

  // Define path for the rounded rectangle hole
  const roundedRectPath = `
    M ${x + borderRadius} ${y}
    h ${width - 2 * borderRadius}
    a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} ${borderRadius}
    v ${height - 2 * borderRadius}
    a ${borderRadius} ${borderRadius} 0 0 1 -${borderRadius} ${borderRadius}
    h -${width - 2 * borderRadius}
    a ${borderRadius} ${borderRadius} 0 0 1 -${borderRadius} -${borderRadius}
    v -${height - 2 * borderRadius}
    a ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} -${borderRadius}
    Z
  `

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg width={screenWidth} height={screenHeight}>
        <Defs>
          {/* Define the mask with a rounded rectangle hole */}
          <Mask id="mask">
            {/* Full-screen white background (keeps area opaque) */}
            <Rect x="0" y="0" width={screenWidth} height={screenHeight} fill="white" />

            {/* Rounded rectangle path to create the hole */}
            <Path d={roundedRectPath} fill="black" />
          </Mask>
        </Defs>

        {/* Apply the mask to the semi-transparent backdrop */}
        <Rect
          x="0"
          y="0"
          width={screenWidth}
          height={screenHeight}
          fill={bgColor}
          mask="url(#mask)"
        />

        {/* Add a colored border around the hole */}
        <G>
          <Path d={roundedRectPath} fill="none" stroke={borderColor} strokeWidth={borderWidth} />
        </G>
      </Svg>
    </View>
  )
}

export default BackdropWithHole
