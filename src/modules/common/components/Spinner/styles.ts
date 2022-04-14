import { StyleSheet, ViewProps } from 'react-native'

interface Style {
  spinner: ViewProps
}

const styles = StyleSheet.create<Style>({
  spinner: {
    width: 40,
    height: 40
  }
})

export default styles
