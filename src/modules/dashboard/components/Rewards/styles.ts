import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  loading: ViewStyle
  button: ViewStyle
  buttonClaim: ViewStyle
}

const styles = StyleSheet.create<Style>({
  loading: {
    height: 30
  },
  button: {
    width: 'auto'
  },
  buttonClaim: {
    width: 'auto',
    alignSelf: 'flex-end'
  }
})

export default styles
