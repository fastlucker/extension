import { StyleSheet, TextStyle } from 'react-native'

interface Style {
  text: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    fontSize: 40
  }
})

export default styles
