import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings, { SPACING_MD, SPACING_SM } from '@modules/common/styles/spacings'

interface Styles {
  networksContainer: ViewProps
  networkBtnContainer: ViewProps
  networkBtnContainerActive: ViewProps
  networkBtnIcon: ViewProps
}

const ICON_WRAPPER_SIZE = 32

const styles = StyleSheet.create<Styles>({
  networksContainer: {
    // Because the content goes beyond the parent wrapper
    marginHorizontal: -1 * SPACING_SM
  },
  networkBtnContainer: {
    width: '100%',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: ICON_WRAPPER_SIZE + SPACING_MD,
    ...spacings.prMd,
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
