import { StyleSheet, TextStyle } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Style {
  text: TextStyle
}

const styles = StyleSheet.create<Style>({
  text: {
    fontSize: 24,
    fontWeight: '600',
    paddingBottom: 20
  }
})

export default styles
