import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  panelWrapper: ViewStyle
  selectorsContainer: ViewStyle
  feeSelector: ViewStyle
  selected: ViewStyle
}

const styles = StyleSheet.create<Style>({
  panelWrapper: {
    zIndex: 500
  },
  selectorsContainer: {
    flexDirection: 'row',
    flex: 1,
    ...spacings.pvTy,
    marginHorizontal: -5
  },
  feeSelector: {
    padding: 2,
    minHeight: 70,
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
