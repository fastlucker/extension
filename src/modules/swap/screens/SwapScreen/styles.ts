import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  webview: ViewStyle
}

const styles = StyleSheet.create<Style>({
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  }
})

export default styles
