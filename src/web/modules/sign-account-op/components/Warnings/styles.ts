import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  container: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Styles>({
    container: {
      marginTop: 'auto'
    }
  })

export default getStyles
