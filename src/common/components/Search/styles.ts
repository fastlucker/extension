import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  input: ViewStyle
}

const styles = StyleSheet.create<Style>({
  input: {
    height: 32
  }
})

export default styles
