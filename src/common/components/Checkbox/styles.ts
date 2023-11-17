import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

interface Style {
  container: ViewStyle
  checkboxWrapper: ViewStyle
  checkbox: ViewStyle
  webCheckbox: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    ...spacings.mb
  },
  checkboxWrapper: {
    // Because the rn-checkbox can't get smaller than 20
    //  it should be scaled down to ~18
    transform: [{ scale: 0.9 }],
    ...spacings.mr
  },
  checkbox: {
    width: 20,
    height: 20
  },
  webCheckbox: {
    overflow: 'hidden',
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.greenHaze,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20
  }
})

export default styles
