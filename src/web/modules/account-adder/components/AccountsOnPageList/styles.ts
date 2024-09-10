import { StyleSheet, ViewStyle } from 'react-native'

interface Styles {
  spinner: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  spinner: {
    width: 28,
    height: 28,
    // Prevents the spinner from overflowing the container, causing an annoying vertical scrollbar
    overflow: 'hidden'
  }
})

export default styles
