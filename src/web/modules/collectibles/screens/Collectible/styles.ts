import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import colors from '@common/styles/colors'
import spacings, { SPACING_LG, SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  view: ViewStyle
  container: ViewStyle
  contentContainer: ViewStyle
  section: ViewStyle
  sectionTitle: TextStyle
  sectionSubtitle: TextStyle
  // Info
  info: ViewStyle
  infoImageWrapper: ViewStyle
  infoImage: ImageStyle
  infoItem: ViewStyle
  itemValue: TextStyle
  copyIcon: ViewStyle
  // Owner
  ownerContainer: ViewStyle
  owner: ViewStyle
  blocky: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    view: flexbox.flex1,
    container: {
      backgroundColor: colors.white,
      ...flexbox.flex1,
      paddingTop: SPACING_LG * 2
    },
    contentContainer: {
      ...flexbox.flex1,
      ...flexbox.directionRow,
      ...commonWebStyles.contentContainer
    },
    section: {
      ...flexbox.flex1
    },
    infoImageWrapper: {
      ...flexbox.center,
      width: 210,
      height: 210,
      borderRadius: 12,
      backgroundColor: theme.secondaryBackground,
      ...spacings.mbLg
    },
    infoImage: {
      width: 148,
      height: 148,
      borderRadius: 12
    },
    infoItem: {
      ...spacings.mbMd
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: FONT_FAMILIES.SEMI_BOLD,
      ...spacings.mbLg
    },
    sectionSubtitle: {
      fontSize: 16,
      fontFamily: FONT_FAMILIES.MEDIUM,
      ...spacings.mbMi
    },
    itemValue: {
      fontSize: 14,
      fontFamily: FONT_FAMILIES.REGULAR
    },
    copyIcon: {
      ...spacings.mlMi,
      marginBottom: SPACING_MI / 2
    },
    info: {},
    ownerContainer: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    owner: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...spacings.mlTy
    },
    blocky: { borderRadius: 12, overflow: 'hidden', width: 34, height: 34 }
  })

export default getStyles
