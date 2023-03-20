import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  contentWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  contentWrapper: { width: 315, alignSelf: 'center' }
})

export default styles
