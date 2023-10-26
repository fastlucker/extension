import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  inputContainer: ViewStyle
  input: ViewStyle
}

const styles = StyleSheet.create<Style>({
  inputContainer: {
    marginBottom: 10
  },
  input: {
    height: 40
  }
})

export default styles
