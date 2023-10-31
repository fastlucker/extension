import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  container: ViewStyle
  warningContainer: ViewStyle
  header: ViewStyle
  headerContent: ViewStyle
  body: ViewStyle
  bodyText: TextStyle
  explorerIcon: ViewStyle
}

const { isTab } = getUiType()

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.melrose_15,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.chetwode_50
  },
  warningContainer: {
    borderWidth: 1,
    borderColor: colors.pirateGold
  },
  header: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    ...flexbox.justifyCenter,
    ...flexbox.justifySpaceBetween,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  headerContent: {
    ...flexbox.flex1,
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    ...flexbox.wrap,
    marginHorizontal: 10
  },
  body: {
    padding: 10
  },
  bodyText: {
    marginBottom: isTab ? 25 : 5,
    color: colors.martinique
  },
  explorerIcon: {
    marginLeft: -4
  }
})

export default styles
