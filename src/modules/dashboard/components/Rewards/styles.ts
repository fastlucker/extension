import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  loading: ViewStyle
  buttonClaim: ViewStyle
}

const styles = StyleSheet.create<Style>({
  loading: {
    height: 30
  },
  buttonClaim: {
    width: 'auto',
    alignSelf: 'flex-end'
  }
})

export default styles
