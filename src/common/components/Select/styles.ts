import { ImageStyle, StyleSheet, ViewProps, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING_TY } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  selectContainer: ViewStyle
  selectBorderWrapper: ViewStyle
  select: ViewStyle
  menuBackdrop: ViewStyle
  menuContainer: ViewStyle
  menuOption: ViewProps
  searchContainerStyle: ViewProps
  searchTextInputStyle: ViewProps
  optionIcon: ImageStyle
}

export const MENU_OPTION_HEIGHT = 50
export const MAX_MENU_HEIGHT = 400

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    selectContainer: {
      width: '100%',
      ...spacings.mbSm
    },
    selectBorderWrapper: {
      borderWidth: 2,
      borderRadius: 8,
      borderColor: 'transparent',
      ...common.hidden
    },
    select: {
      width: '100%',
      height: 50,
      ...common.borderRadiusPrimary,
      backgroundColor: theme.secondaryBackground,
      borderWidth: 1,
      ...common.hidden,
      borderColor: 'transparent',
      ...flexbox.justifyCenter,
      ...spacings.ph
    },
    menuBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 901 // higher than the BottomSheet zIndex
    },
    menuContainer: {
      backgroundColor: theme.primaryBackground,
      ...spacings.mvMi,
      ...common.borderRadiusPrimary,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      ...common.shadowSecondary,
      position: 'absolute',
      maxHeight: MAX_MENU_HEIGHT,
      ...flexbox.flex1,
      zIndex: 902 // // higher than the menuBackdrop zIndex
    },
    menuOption: {
      height: MENU_OPTION_HEIGHT,
      ...spacings.ph,
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    searchContainerStyle: {
      flexDirection: 'column-reverse',
      width: '100%',
      alignItems: 'flex-end',
      ...spacings.ph,
      ...spacings.pt,
      ...spacings.pbTy,
      borderBottomWidth: 0
    },
    searchTextInputStyle: {
      marginTop: SPACING_TY,
      width: '100%',
      height: 50,
      borderRadius: 13,
      backgroundColor: colors.howl,
      borderWidth: 0,
      fontSize: 16,
      ...spacings.phTy,
      color: colors.titan
    },
    optionIcon: {
      width: 30,
      height: 30,
      ...common.borderRadiusPrimary,
      ...spacings.mrTy
    }
  })

export default getStyles
