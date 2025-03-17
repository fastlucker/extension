import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  container: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Styles>({
    container: {}
  })

export default getStyles
