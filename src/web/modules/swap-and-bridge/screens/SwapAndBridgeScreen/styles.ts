import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

interface Style {
  form: ViewStyle
  container: ViewStyle
  followUpTxnText: TextStyle
}

const { isActionWindow } = getUiType()

// Make the form slightly larger in action window
// so it stretches as much as the header
export const SWAP_AND_BRIDGE_FORM_WIDTH = isActionWindow ? 656 : 600

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    form: {
      ...spacings.ph,
      ...spacings.pb,
      ...spacings.ptMd,
      ...spacings.mbMd,
      borderRadius: 12,
      backgroundColor: theme.primaryBackground,
      shadowColor: theme.primaryBorder,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 10
    },
    container: {
      width: '100%',
      maxWidth: SWAP_AND_BRIDGE_FORM_WIDTH,
      flex: 1,
      alignSelf: 'center',
      overflow: 'visible'
    },
    followUpTxnText: {
      ...spacings.plTy,
      ...spacings.prMi,
      ...spacings.mrMi,
      ...spacings.pvMi,
      ...common.borderRadiusPrimary
    }
  })

export default getStyles
