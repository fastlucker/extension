import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  button: ViewStyle
  buttonText: TextStyle
}

const styles = StyleSheet.create<Style>({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 2,
    backgroundColor: '#AA6AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF'
  }
})

export default styles
