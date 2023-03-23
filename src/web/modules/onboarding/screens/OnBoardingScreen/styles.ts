import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  title: TextStyle
  sideContent: ViewStyle
}

const styles = StyleSheet.create<Style>({
  title: {
    textAlign: 'center',
    position: 'relative',
    top: -205
  },
  sideContent: {
    position: 'relative',
    zIndex: -1
  }
})

export default styles
