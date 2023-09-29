import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  container: ViewStyle
  header: ViewStyle
  headerContent: ViewStyle
  action: TextStyle
  tokenImg: ImageStyle
  to: TextStyle
  body: ViewStyle
  bodyText: TextStyle
  text: TextStyle
  // @TODO - once we update react-native to 0.71, then we will have `gap` support and can remove this helper class
  mr5: {}
}

const { isTab } = getUiType()

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.melrose_15,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.chetwode_50
  },
  header: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    ...flexbox.justifyCenter,
    ...flexbox.justifySpaceBetween,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  headerContent: {
    ...flexbox.flex1,
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    ...flexbox.wrap,
    marginHorizontal: 10
  },
  text: {
    fontSize: isTab ? 16 : 14
  },
  mr5: {
    marginRight: 5
  },
  action: {
    color: colors.greenHaze
  },
  tokenImg: {
    width: isTab ? 24 : 18,
    height: isTab ? 24 : 18
  },
  to: {
    color: colors.martinique_65
  },
  body: {
    padding: 10
  },
  bodyText: {
    marginBottom: isTab ? 25 : 5,
    color: colors.martinique
  }
})

export default styles
