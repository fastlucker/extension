/**
 * Credits to Brennen Peters for writing the logic for this module.
 * This one is based on his module, but slightly changed and enhanced
 * with additional props, to match our use-case better.
 * {@link https://github.com/bpeters}
 * {@link https://github.com/bpeters/react-native-blockies-svg/blob/197fb5932be263489f6f762f0a7d4d18e7161dbc/index.js}
 */

import React from 'react'
import { View } from 'react-native'
import Svg, { Rect } from 'react-native-svg'

import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

const randseed = new Array(4)

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
  seed: _seed,
  color: _color,
  bgcolor: _bgcolor,
  spotcolor: _spotcolor,
  size = 8,
  scale = 4,
  isRound = true,
  borderRadius = BORDER_RADIUS_PRIMARY,
  borderWidth = 0,
  borderColor
}) => {
  const seedrand = (seed: Props['seed']) => {
    for (let i = 0; i < randseed.length; i++) {
      randseed[i] = 0
    }

    for (let i = 0; i < seed.length; i++) {
      randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i)
    }
  }

  const rand = () => {
    const t = randseed[0] ^ (randseed[0] << 11)

    randseed[0] = randseed[1]
    randseed[1] = randseed[2]
    randseed[2] = randseed[3]
    randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8)

    return (randseed[3] >>> 0) / ((1 << 31) >>> 0)
  }

  const createColor = () => {
    const h = Math.floor(rand() * 360)
    const s = `${rand() * 60 + 40}%`
    const l = `${(rand() + rand() + rand() + rand()) * 25}%`

    const color = `hsl(${h},${s},${l})`

    return color
  }

  const createImageData = (size: Props['size']) => {
    const width = size
    const height = size

    const dataWidth = Math.ceil(width / 2)
    const mirrorWidth = width - dataWidth

    const data = []

    for (let y = 0; y < height; y++) {
      let row = []

      for (let x = 0; x < dataWidth; x++) {
        row[x] = Math.floor(rand() * 2.3)
      }

      const r = row.slice(0, mirrorWidth)

      r.reverse()

      row = row.concat(r)

      for (let i = 0; i < row.length; i++) {
        data.push(row[i])
      }
    }

    return data
  }

  const renderIcon = (size, scale) => {
    const seed = _seed || Math.floor(Math.random() * 10 ** 16).toString(16)

    seedrand(seed)

    const color = _color || createColor()
    const bgcolor = _bgcolor || createColor()
    const spotcolor = _spotcolor || createColor()

    const imageData = createImageData(size)
    const width = Math.sqrt(imageData.length)

    return imageData.map((item, i) => {
      let fill = bgcolor

      if (item) {
        if (item === 1) {
          fill = color
        } else {
          fill = spotcolor
        }
      }

      const row = Math.floor(i / size)
      const col = i % size

      return (
        <Rect key={i} x={row * scale} y={col * scale} width={scale} height={scale} fill={fill} />
      )
    })
  }

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
        {renderIcon(size, scale)}
      </Svg>
    </View>
  )
}

export default Blockie
