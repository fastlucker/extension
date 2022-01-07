import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'

interface Style {
  row: ViewStyle
  header: ViewStyle
  footer: ViewStyle
  headerTitle: ViewStyle
  rowItem: ViewStyle
  rowItemMain: ViewStyle
  img: ImageStyle
  fallbackImage: TextStyle
  balance: TextStyle
  btnContainer: ViewStyle
  btn: TextStyle
  balanceFiat: TextStyle
  symbol: TextStyle
  infoText: TextStyle
  subInfoText: TextStyle
  emptyStateContainer: TextStyle
  emptyStateText: TextStyle
}

const styles = StyleSheet.create<Style>({
  row: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: colors.headerColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...spacings.ph,
    ...spacings.pv
  },
  footer: {
    ...spacings.phTy,
    ...spacings.pvSm,
    ...spacings.pb0
  },
  headerTitle: {
    fontSize: 20,
    ...spacings.pb0
  },
  btnContainer: {
    backgroundColor: colors.secondaryButtonColor,
    ...spacings.phTy,
    ...spacings.pvTy
  },
  btn: {
    fontSize: 14,
    textTransform: 'uppercase',
    ...textStyles.bold
  },
  rowItem: {
    ...spacings.ph,
    ...spacings.pvSm
  },
  rowItemMain: {
    flex: 1,
    ...spacings.ph0
  },
  img: {
    width: 35,
    height: 35
  },
  fallbackImage: {
    fontSize: 32
  },
  balance: {
    fontSize: 18
  },
  balanceFiat: {
    fontSize: 14
  },
  symbol: {
    fontSize: 18,
    ...textStyles.bold
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    opacity: 0.5,
    ...spacings.pbTy,
    ...spacings.plTy
  },
  subInfoText: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center'
  },
  emptyStateContainer: {
    ...spacings.ptSm,
    ...spacings.phSm
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    ...textStyles.bold,
    ...spacings.mbSm
  }
})

export default styles
