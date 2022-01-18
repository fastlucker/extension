import { StyleSheet, TextStyle } from 'react-native'

interface Style {
  text: TextStyle
  bottomSpacing: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    fontSize: 24,
    fontWeight: '600'
  },
  bottomSpacing: {
    paddingBottom: 20
  }
})

export default styles
