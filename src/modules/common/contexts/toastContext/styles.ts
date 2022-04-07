import { StyleSheet, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  container: ViewStyle
  toastWrapper: ViewStyle
  toast: ViewStyle
  error: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
    elevation: 20,
    ...spacings.ph
  },
  toastWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    ...spacings.mbTy
  },
  toast: {
    backgroundColor: colors.onahau,
    borderLeftColor: colors.turquoise,
    borderLeftWidth: 8,
    alignItems: 'center',
    flexDirection: 'row',
    ...spacings.pvTy,
    ...spacings.phTy,
    height: 'auto',
    minHeight: 50,
    width: '100%',
    flex: 1
  },
  error: {
    backgroundColor: colors.pigPink,
    borderLeftColor: colors.pink
  }
})

export default styles
