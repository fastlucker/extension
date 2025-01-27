import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  pressable: ViewStyle
}

const styles = StyleSheet.create<Style>({
  pressable: {
    // @ts-ignore prop (not in types, but it works) make it less obvious that this is a pressable
    cursor: 'default'
  }
})

export default styles
