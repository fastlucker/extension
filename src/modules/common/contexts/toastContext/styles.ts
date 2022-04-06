import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings, { DEVICE_WIDTH } from '@modules/common/styles/spacings'

interface Style {
  container: ViewStyle
  toast: ViewStyle
  error: ViewStyle
  text: TextStyle
  rightIcon: ViewStyle
  closeIcon: ViewStyle
  badge: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    position: 'absolute',
    width: DEVICE_WIDTH,
    zIndex: 999,
    elevation: 20,
    paddingHorizontal: 20
  },
  toast: {
    backgroundColor: colors.onahau,
    borderLeftColor: colors.turquoise,
    borderLeftWidth: 9,
    alignItems: 'center',
    flexDirection: 'row',
    ...spacings.pvTy,
    ...spacings.phTy,
    height: 'auto',
    minHeight: 50,
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
    flex: 1
  },
  error: {
    backgroundColor: colors.pigPink,
    borderLeftColor: colors.pink
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primaryButtonTextColor,
    flex: 1
  },
  rightIcon: {
    ...spacings.prTy
  },
  closeIcon: {
    ...spacings.plTy
  },
  badge: {
    ...spacings.mrTy,
    height: 22,
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: colors.dangerColor
  }
})

export default styles
