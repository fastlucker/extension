import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, ColorValue, GestureResponderEvent, MouseEvent, ViewStyle } from 'react-native'

import DURATIONS from './durations'

export type AnimationValues = {
  property: keyof ViewStyle
  from: number | ColorValue
  to: number | ColorValue
  duration?: number
}

type AnimationValuesExtended = AnimationValues & {
  value: Animated.Value
  duration: number
}

interface Props {
  values: AnimationValues[]
  forceHoveredStyle?: boolean
}

/*
  Some of the values have to be interpolated, like backgroundColor, color, borderColor
*/
const INTERPOLATE_PROPERTIES = ['backgroundColor', 'color', 'borderColor']

const useMultiHover = ({ values, forceHoveredStyle = false }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const animatedValuesRef = useRef<AnimationValuesExtended[] | null>(null)
  const animatedValues = animatedValuesRef.current

  useEffect(() => {
    const opacity = values.find(({ property }) => property === 'opacity')

    animatedValuesRef.current = values.map(({ property, from, to, duration: valueDuration }) => {
      const shouldInterpolate = INTERPOLATE_PROPERTIES.includes(property)
      let value = null

      if (forceHoveredStyle) {
        value = new Animated.Value(shouldInterpolate ? 1 : (to as number))
        setIsHovered(true)
      } else {
        value = new Animated.Value(shouldInterpolate ? 0 : (from as number))
        setIsHovered(false)
      }

      return {
        value,
        property,
        from,
        to,
        duration: valueDuration || DURATIONS.FAST
      }
    })

    if (opacity) return

    // Opacity is always needed for onPressIn and onPressOut
    animatedValuesRef.current.push({
      value: new Animated.Value(1),
      property: 'opacity',
      from: 1,
      to: 1,
      duration: DURATIONS.FAST
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.length, forceHoveredStyle])

  useEffect(() => {
    if (!animatedValues) return

    animatedValues.forEach(
      ({ property, value, from, to, duration: valueDuration }: AnimationValuesExtended) => {
        const toValue = !INTERPOLATE_PROPERTIES.includes(property) ? (to as number) : 1
        const fromValue = !INTERPOLATE_PROPERTIES.includes(property) ? (from as number) : 0

        Animated.timing(value, {
          toValue: isHovered || forceHoveredStyle ? toValue : fromValue,
          duration: valueDuration,
          useNativeDriver: true
        }).start()
      }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, forceHoveredStyle])

  useEffect(() => {
    if (!animatedValues) return

    const opacity = animatedValues.find(({ property }) => property === 'opacity')

    if (!opacity) return

    Animated.timing(opacity.value, {
      toValue: isPressed ? 0.7 : 1,
      duration: 0,
      useNativeDriver: true
    }).start()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPressed])

  const bind = useMemo(
    () => ({
      onHoverIn: () => {
        setIsHovered(true)
      },
      onHoverOut: () => {
        setIsHovered(false)
      },
      onPressIn: () => {
        setIsPressed(true)
      },
      onPressOut: () => {
        setIsPressed(false)
      }
    }),
    []
  )

  const style = useMemo(() => {
    if (animatedValues)
      return animatedValues?.reduce((acc, { property, value, from, to }) => {
        const shouldInterpolate = INTERPOLATE_PROPERTIES.includes(property)

        return {
          ...acc,
          [property]: shouldInterpolate
            ? value.interpolate({
                inputRange: [0, 1],
                outputRange: [from as string, to as string]
              })
            : value
        }
      }, {})

    // Prevents the hook from returning an empty style object on the first render
    return values.reduce(
      (acc, { property, from }) => ({
        ...acc,
        [property]: from
      }),
      {}
    )
  }, [animatedValues, values])

  const triggerHover = useCallback(() => {
    setIsHovered(true)
  }, [])

  return [bind, style, isHovered, triggerHover, animatedValues] as [
    {
      onHoverIn: (event: MouseEvent) => void
      onHoverOut: (event: MouseEvent) => void
      onPressIn: (event: GestureResponderEvent) => void
      onPressOut: (event: GestureResponderEvent) => void
    },
    ViewStyle,
    boolean,
    () => void,
    AnimationValuesExtended[] | null
  ]
}

export default useMultiHover
