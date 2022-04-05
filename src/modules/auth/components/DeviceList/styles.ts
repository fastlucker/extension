import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  deviceItemsContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  deviceItemsContainer: {
    // (button height * 2) + (button bottom spacing * 2)
    minHeight: 140
  }
})

export default styles
