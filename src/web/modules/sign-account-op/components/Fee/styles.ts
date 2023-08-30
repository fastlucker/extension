import { StyleSheet, TextStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'

interface Style {
  label: TextStyle
}

const styles = StyleSheet.create<Style>({
  label: {
    marginBottom: 4
  }
})

export default styles
