import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  selectorsContainer: ViewStyle
  feeSelector: ViewStyle
  selected: ViewStyle
  customFeeContainer: ViewStyle
  unstableFeeContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  selectorsContainer: {
    flexDirection: 'row',
    flex: 1,
    ...spacings.mb,
    marginHorizontal: -2.5
  },
  feeSelector: {
    padding: 2,
    minHeight: 90,
    flex: 1,
    marginHorizontal: 2.5,
    overflow: 'hidden',
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.backgroundColor
  },
  customFeeContainer: {
    ...spacings.mbTy
  },
  unstableFeeContainer: {
    ...spacings.pvTy,
    ...spacings.phTy,
    backgroundColor: colors.backgroundColor,
    flexDirection: 'row',
    alignItems: 'center'
  },
  selected: {
    borderColor: colors.ambireDarkBlue
  }
})

export default styles
