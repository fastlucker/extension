import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'

interface Style {
  button: ViewStyle
  dropdown: ViewStyle
  overlay: ViewStyle
  item: ViewStyle
}

const styles = StyleSheet.create<Style>({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    position: 'relative',
    zIndex: 1,
    ...spacings.ph,
    ...spacings.pvTy
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.white,
    width: 155,
    ...common.shadowPrimary,
    ...common.borderRadiusPrimary,
    ...spacings.phTy,
    ...spacings.pvTy
  },
  overlay: {
    width: '100%',
    height: '100%'
  },
  item: {
    paddingHorizontal: 5,
    paddingVertical: 5
  }
})

export default styles
