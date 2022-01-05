import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  inputContainer: ViewStyle
  input: ViewStyle
  button: ViewStyle
}

const styles = StyleSheet.create<Style>({
  inputContainer: {
    position: 'relative'
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    padding: 12,
    marginBottom: 16
  },
  button: {
    position: 'absolute',
    right: 0,
    height: 40,
    paddingHorizontal: 8,
    justifyContent: 'center'
  }
})

export default styles
