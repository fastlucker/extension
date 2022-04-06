import { StyleSheet, ViewProps, ViewStyle } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings, { SPACING_SM, SPACING_TY } from '@modules/common/styles/spacings'

interface Styles {
  switcherContainer: ViewStyle
  accountContainerActive: ViewProps
  activeBlockieStyle: ViewProps
  networkBtnContainer: ViewProps
  networkBtnContainerActive: ViewProps
  networkBtnIcon: ViewProps
}

const ICON_WRAPPER_SIZE = 32

const styles = StyleSheet.create<Styles>({
  switcherContainer: {
    backgroundColor: colors.valhalla,
    height: 50,
    borderRadius: 13,
    paddingLeft: 10,
    paddingRight: 15,
    marginHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  accountContainerActive: {
    backgroundColor: colors.howl,
    borderRadius: 13,
    marginHorizontal: -1 * SPACING_SM,
    ...spacings.pvTy,
    ...spacings.phSm
  },
  activeBlockieStyle: {
    borderWidth: 3,
    borderRadius: 50,
    borderColor: colors.lightViolet
  },
  networkBtnContainer: {
    width: '100%',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: ICON_WRAPPER_SIZE + SPACING_TY,
    ...spacings.prTy,
    ...spacings.pvTy
  },
  networkBtnContainerActive: {
    backgroundColor: colors.howl
  },
  networkBtnIcon: {
    width: ICON_WRAPPER_SIZE,
    height: ICON_WRAPPER_SIZE,
    backgroundColor: colors.valhalla,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default styles
