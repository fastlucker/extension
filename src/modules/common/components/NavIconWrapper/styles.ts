import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  wrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    overflow: 'hidden',
    borderRadius: 13
  }
})

export default styles
