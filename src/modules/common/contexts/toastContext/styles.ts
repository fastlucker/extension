import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
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
    bottom: 74,
    width: DEVICE_WIDTH,
    zIndex: 10000
  },
  toast: {
    backgroundColor: colors.primaryAccentColor,
    borderLeftWidth: 0,
    alignItems: 'center',
    flexDirection: 'row',
    ...spacings.pvTy,
    ...spacings.phTy,
    height: 'auto',
    width: DEVICE_WIDTH,
    marginBottom: 5,
    borderRadius: 2,
    flex: 1
  },
  error: {
    backgroundColor: colors.dangerColor
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
