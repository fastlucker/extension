import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  selectorsContainer: ViewStyle
  feeSelector: ViewStyle
  selected: ViewStyle
}

const styles = StyleSheet.create<Style>({
  selectorsContainer: {
    flexDirection: 'row',
    flex: 1,
    ...spacings.pvTy,
    marginHorizontal: -5
  },
  feeSelector: {
    padding: 2,
    minHeight: 90,
    flex: 1,
    marginHorizontal: 5,
    overflow: 'hidden',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#ccc'
  },
  selected: {
    borderColor: colors.primaryAccentColor
  }
})

export default styles
