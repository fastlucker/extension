import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  icon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  icon: {
    borderRadius: 50
  }
})

export default styles
