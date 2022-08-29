import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  toggleContainer: ViewStyle
  toggleItemWrapper: ViewStyle
  toggleItem: ViewStyle
  invertedRadiusWrapper: ViewStyle
}

const styles = StyleSheet.create<Style>({
  toggleContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  toggleItemWrapper: {
    width: '50%',
    borderTopStartRadius: 13,
    borderTopRightRadius: 13,
  },
  toggleItem: {
    flex: 1,
    alignItems: 'center',
    // ...spacings.pvTy,
    paddingTop: 10,
    paddingBottom: 10,
  },
  invertedRadiusWrapper: {
    height: '100%',
    position: 'absolute',
    justifyContent: 'flex-end',
    left: '50%',
  },
})

export default styles
