import { StyleSheet, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  container: ViewStyle
  modal: ViewStyle
  modalHeader: ViewStyle
  sideContainer: ViewStyle
  backButton: ViewStyle
  closeIcon: ViewStyle
}

const { isTab } = getUiType()

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.justifyCenter,
      ...flexbox.alignCenter,
      backgroundColor: theme.backdrop
    },
    modal: {
      borderRadius: isTab ? BORDER_RADIUS_PRIMARY : 0,
      ...spacings.phLg,
      ...spacings.pvLg,
      ...flexbox.alignCenter,
      ...common.shadowSecondary,
      backgroundColor: theme.primaryBackground,
      minWidth: isTab ? 798 : '100%',
      height: isTab ? 'auto' : '100%',
      ...(isWeb ? { cursor: 'default' } : {})
    },
    modalHeader: {
      position: 'relative',
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...flexbox.alignCenter,
      ...spacings.mbLg,
      width: '100%'
    },
    sideContainer: {
      width: 120,
      minWidth: 120,
      ...flexbox.justifyCenter
    },
    backButton: {
      ...flexbox.alignSelfStart
    },
    closeIcon: {
      ...flexbox.alignSelfEnd
    }
  })

export default getStyles
