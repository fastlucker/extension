import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  errorContainer: ViewStyle
  spinner: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Styles>({
    errorContainer: {
      marginTop: 'auto',
      paddingTop: 10
    },
    spinner: {
      alignSelf: 'center'
    }
  })

export default getStyles
