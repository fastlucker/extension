import { useState } from 'react'
import { Pressable, PressableProps, View, ViewStyle } from 'react-native'

import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

interface Props extends PressableProps {
  style?: ViewStyle
  states: { text: string; callback: Function }[]
}

const MultistateToggleButton = ({ style, states }: Props) => {
  const { styles } = useTheme(getStyles)

  const [activeState, setActiveState] = useState(0)
  return (
    <View style={[styles.container, style]}>
      {states.map(({ text, callback }, i) => (
        <Pressable
          style={[styles.element, i === activeState && styles.activeElement]}
          onPress={() => {
            callback()
            setActiveState(i)
          }}
          key={text}
        >
          {text}
        </Pressable>
      ))}
    </View>
  )
}

export default MultistateToggleButton
