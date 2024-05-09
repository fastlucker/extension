import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  errorContainer: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Styles>({
    errorContainer: {
      marginTop: 'auto',
      paddingTop: 10
    }
  })

export default getStyles
