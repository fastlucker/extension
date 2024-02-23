import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, ViewStyle } from 'react-native'

import DURATIONS from './durations'

type AnimationValues = {
  key: keyof ViewStyle
  from: number
  to: number
  duration?: number
}

type AnimationValuesExtended = AnimationValues & {
  value: Animated.Value
}

interface Props {
  values: AnimationValues[]
  duration?: number
}

const useMultiHover = ({ values, duration = DURATIONS.REGULAR }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const animatedValuesRef = useRef<AnimationValuesExtended[] | null>(null)
  const animatedValues = animatedValuesRef.current

  useEffect(() => {
    animatedValuesRef.current = values.map(({ key, from, to, duration: valueDuration }) => ({
      value: new Animated.Value(from),
      key,
      from,
      to,
      duration: valueDuration
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.length])

  useEffect(() => {
    if (!animatedValues) return

    animatedValues.forEach(
      ({ value, from, to, duration: valueDuration }: AnimationValuesExtended) => {
        Animated.timing(value, {
          toValue: isHovered ? to : from,
          duration: valueDuration || duration,
          useNativeDriver: true
        }).start()
      }
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered])

  const bind = useMemo(
    () => ({
      onHoverIn: () => {
        setIsHovered(true)
      },
      onHoverOut: () => {
        setIsHovered(false)
      }
    }),
    []
  )

  const style = useMemo(() => {
    if (animatedValues)
      return animatedValues?.reduce(
        (acc, { key, value }) => ({
          ...acc,
          [key]: value
        }),
        {}
      )

    // Prevents the hook from returning an empty style object on the first render
    return values.reduce(
      (acc, { key, from }) => ({
        ...acc,
        [key]: from
      }),
      {}
    )
  }, [animatedValues, values])

  return [bind, style, isHovered] as [
    {
      onHoverIn: () => void
      onHoverOut: () => void
    },
    ViewStyle,
    boolean
  ]
}

export default useMultiHover
