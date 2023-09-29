import { StyleSheet, TextStyle } from 'react-native'

import colors from '@common/styles/colors'

interface Style {
  container: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    color: colors.martinique
  }
})

export default styles
