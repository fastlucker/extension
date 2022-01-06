import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  inputContainer: ViewStyle
  input: ViewStyle
  info: TextStyle
}

const styles = StyleSheet.create<Style>({
  inputContainer: {
    marginBottom: 16
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    padding: 12
  },
  info: {
    paddingTop: 8
  }
})

export default styles
