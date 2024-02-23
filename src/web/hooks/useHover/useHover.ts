import { Animated, Pressable } from 'react-native'

import useCustomHover from './useCustomHover'

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface Props {
  preset: 'opacity'
  duration?: number
}

const presets = {
  opacity: {
    from: 0.7,
    to: 1
  }
}

const useHover = ({ preset, duration }: Props) => {
  const value = useCustomHover({
    property: preset,
    values: presets[preset],
    duration
  })

  return value
}

export default useHover
