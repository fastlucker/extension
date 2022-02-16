import { StyleSheet, TextProps, ViewProps } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings, { SPACING_TY } from '@modules/common/styles/spacings'

interface Style {
  dropdown: ViewProps
  dropDownContainerStyle: ViewProps
  listItemContainerStyle: ViewProps
  searchContainerStyle: ViewProps
  searchTextInputStyle: ViewProps
  labelStyle: TextProps
  listItemLabelStyle: TextProps
}

const styles = StyleSheet.create<Style>({
  dropdown: {
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 0,
    borderColor: colors.inputBackgroundColor,
    height: 50,
    ...spacings.mbSm
  },
  labelStyle: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '700'
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
  }
})

export default styles
