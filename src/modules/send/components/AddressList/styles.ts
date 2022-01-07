import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  formTitleWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  formTitleWrapper: {
    alignItems: 'center'
  }
})

export default styles
