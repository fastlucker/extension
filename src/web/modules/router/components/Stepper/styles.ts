import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  container: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    maxWidth: 700,
    marginRight: 'auto',
    marginLeft: 'auto'
  }
})

export default styles
