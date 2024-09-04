import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PressableProps, View, ViewStyle } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

interface Props extends PressableProps {
  style?: ViewStyle
  states: { text: string; callback: Function }[]
}

const MultistateToggleButton = ({ style, states }: Props) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const [activeState, setActiveState] = useState(0)
  const switchState = useCallback((callback: Function, i: number) => {
    callback()
    setActiveState(i)
  }, [])
  return (
    <View style={[styles.container, style]}>
      {states.map(({ text, callback }, i) => (
        <Text
          style={[styles.element, i === activeState && styles.activeElement]}
          onPress={() => switchState(callback, i)}
          key={text}
          fontSize={14}
        >
          {t(text)}
        </Text>
      ))}
    </View>
  )
}

export default MultistateToggleButton
