import { Animated, Pressable, ViewStyle } from 'react-native'

import useCustomHover from './useCustomHover'

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface Presets {
  [key: string]: {
    property: keyof ViewStyle
    from: number
    to: number
  }
}

const presets: Presets = {
  opacity: {
    property: 'opacity',
    from: 0.7,
    to: 1
  },
  opacityInverted: {
    property: 'opacity',
    from: 1,
    to: 0.7
  }
}

interface Props {
  preset: keyof typeof presets
  duration?: number
  forceHoveredStyle?: boolean
}

const useHover = ({ preset, duration, forceHoveredStyle }: Props) => {
  const value = useCustomHover({
    property: presets[preset].property,
    values: presets[preset],
    duration,
    forceHoveredStyle
  })

  return value
}

export default useHover
