import { StyleSheet, TextStyle } from 'react-native'

interface Style {
  underline: TextStyle
}

const styles = StyleSheet.create<Style>({
  underline: {
    textDecorationLine: 'underline',
  },
})

export default styles
