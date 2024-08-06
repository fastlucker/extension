import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  icon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  icon: { marginBottom: -1 } // so it is better aligned with the text, vertically
})

export default styles
