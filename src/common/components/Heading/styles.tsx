import { StyleSheet, TextStyle } from 'react-native'

interface Style {
  text: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    marginBottom: 16,
    alignSelf: 'center',
    fontSize: 24
  }
})

export default styles
