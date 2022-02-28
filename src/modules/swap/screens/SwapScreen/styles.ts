import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  webview: ViewStyle
  loadingWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  loadingWrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default styles
