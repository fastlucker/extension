/**
 * Credits to Brennen Peters for writing the logic for this module.
 * This one is based on his module, but slightly changed and enhanced
 * with additional props, to match our use-case better.
 * {@link https://github.com/bpeters}
 * {@link https://github.com/bpeters/react-native-blockies-svg/blob/197fb5932be263489f6f762f0a7d4d18e7161dbc/index.js}
 */

import React from 'react'
import { View } from 'react-native'
import Svg from 'react-native-svg'

import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { renderIcon } from '@common/utils/blockies'

interface Props {
  seed: string
  color?: string
  bgcolor?: string
  spotcolor?: string
  size?: number
  scale?: number
  isRound?: boolean
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
}

const Blockie: React.FC<Props> = ({
  seed,
  color,
  bgcolor,
  spotcolor,
  size = 8,
  scale = 4,
  isRound = true,
  borderRadius = BORDER_RADIUS_PRIMARY,
  borderWidth = 0,
  borderColor
}) => {
  return (
    <View
      style={
        // Wrapping view is required, otherwise, the border radius on Android doesn't work
        // {@link https://github.com/react-native-svg/react-native-svg/issues/1393}
        isRound && {
          borderRadius,
          overflow: 'hidden'
        }
      }
    >
      <Svg
        height={size * scale}
        width={size * scale}
        style={[
          // The generated visuals match the Ethereum Blockies
          // {@link https://github.com/ethereum/blockiesgenerated}
          // generated visuals, but are rotated 90 degrees in the diff side.
          // So this one aligns it correctly.
          { transform: [{ rotate: '90deg' }], borderWidth, borderColor }
        ]}
      >
        {renderIcon(seed, size, scale, color, bgcolor, spotcolor)}
      </Svg>
    </View>
  )
}

export default Blockie
