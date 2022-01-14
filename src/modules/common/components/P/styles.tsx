import { StyleSheet, TextStyle } from 'react-native'

interface Style {
  text: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    marginBottom: 16
  }
})

export default styles
