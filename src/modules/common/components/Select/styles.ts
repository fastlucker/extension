import { StyleSheet, TextProps, ViewProps } from 'react-native'

import { FONT_FAMILIES } from '@modules/common/hooks/useFonts'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings, { SPACING_TY } from '@modules/common/styles/spacings'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  dropdown: ViewProps
  dropDownContainerStyle: ViewProps
  listItemContainerStyle: ViewProps
  searchContainerStyle: ViewProps
  searchTextInputStyle: ViewProps
  modalContentContainerStyle: ViewProps
  labelStyle: TextProps
  listItemLabelStyle: TextProps
  iconContainerStyle: ViewProps
}

const styles = StyleSheet.create<Style>({
  dropdown: {
    backgroundColor: colors.howl,
    ...commonStyles.borderRadiusPrimary,
    borderWidth: 0,
    height: 50,
    ...spacings.mbSm
  },
  labelStyle: {
    color: colors.titan,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.LIGHT
  },
  listItemLabelStyle: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500'
  },
  dropDownContainerStyle: {
    backgroundColor: colors.inputBackgroundColor
  },
  listItemContainerStyle: {
    ...spacings.phSM,
    height: 50
  },
  searchContainerStyle: {
    padding: SPACING_TY,
    borderBottomColor: colors.panelBackgroundColor,
    borderBottomWidth: 1
  },
  searchTextInputStyle: {
    ...spacings.phTy,
    ...spacings.pvTy,
    borderRadius: 0,
    borderColor: colors.inputBackgroundColor,
    color: colors.textColor
  },
  modalContentContainerStyle: {
    backgroundColor: colors.inputBackgroundColor
  },
  iconContainerStyle: {
    backgroundColor: colors.titan_05,
    ...commonStyles.borderRadiusPrimary,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default styles
