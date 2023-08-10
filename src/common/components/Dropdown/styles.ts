import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

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
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    borderRadius: 12,
    ...spacings.ptTy,
    ...spacings.pbTy
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
