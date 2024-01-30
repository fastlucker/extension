import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

import { blockyColors } from '@common/utils/blockies'
import useMainControllerState from '@web/hooks/useMainControllerState'
import { getUiType } from '@web/utils/uiType'

import Gradient from './Gradient/Gradient.web'

export function shadeColor(color: string, amount: number) {
  return `#${color
    .replace(/^#/, '')
    .replace(/../g, (colorToReplace: string) =>
      `0${Math.min(255, Math.max(0, parseInt(colorToReplace, 16) + amount)).toString(16)}`.substr(
        -2
      )
    )}`
}

const { isTab } = getUiType()

const ANIMATION_STEPS = [
  {
    left: 0.25,
    top: -0.5
  },
  {
    left: 0.5,
    top: -0.25
  },
  {
    left: 0.75,
    top: 0.25
  },
  {
    left: 0.5,
    top: 0
  },
  {
    left: 0.25,
    top: -0.25
  },
  {
    left: 0,
    top: 0
  }
]

const Gradients = ({
  size
}: {
  size: {
    width: number
    height: number
  }
}) => {
  const { selectedAccount } = useMainControllerState()
  const { bgcolor, color } = blockyColors(selectedAccount || '')
  const left = useRef(new Animated.Value(0)).current
  const top = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence(
          ANIMATION_STEPS.map(({ left: _left }) => {
            return Animated.timing(left, {
              toValue: size.width * _left,
              duration: isTab ? 10000 : 7500,
              useNativeDriver: true
            })
          })
        ),
        Animated.sequence(
          ANIMATION_STEPS.map(({ top: _top }) =>
            Animated.timing(top, {
              toValue: size.height * _top,
              duration: isTab ? 10000 : 7500,
              useNativeDriver: true
            })
          )
        )
      ])
    ).start()
  }, [left, size, top])

  const scaleInterpolate = left.interpolate({
    inputRange: [0, size.width],
    outputRange: [1, 0.6]
  })

  return (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          top,
          left,
          zIndex: 1,
          width: size.width / 2,
          height: size.height * 2,
          transform: [{ scale: scaleInterpolate }]
        }}
      >
        <Gradient
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: shadeColor(color, -90)
          }}
        />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: top.interpolate({
            inputRange: [0, size.height],
            outputRange: [100, size.height]
          }),
          left: left.interpolate({
            inputRange: [0, size.width],
            outputRange: [-100, size.width]
          }),
          zIndex: 1,
          width: size.width / 3,
          height: size.height * 1.5,
          transform: [{ scale: scaleInterpolate }]
        }}
      >
        <Gradient
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: shadeColor(bgcolor, 40)
          }}
        />
      </Animated.View>
    </>
  )
}

export default React.memo(Gradients)
