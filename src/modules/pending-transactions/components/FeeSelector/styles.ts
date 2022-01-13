import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  selectorsContainer: ViewStyle
  feeSelector: ViewStyle
  selected: ViewStyle
}

const styles = StyleSheet.create<Style>({
  selectorsContainer: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginBottom: 10
  },
  feeSelector: {
    padding: 10,
    minHeight: 70,
    maxWidth: 90,
    marginHorizontal: 5,
    overflow: 'hidden',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc'
  },
  selected: {
    borderColor: colors.primaryAccentColor
  }
})

export default styles
