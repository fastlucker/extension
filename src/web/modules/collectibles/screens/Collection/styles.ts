import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

interface Style {
  contentContainer: ViewStyle
  noCollectibles: TextStyle
}

const isTab = getUiType().isTab

const getStyles = () =>
  StyleSheet.create<Style>({
    contentContainer: {
      ...flexbox.flex1,
      ...flexbox.directionRow,
      ...flexbox.wrap,
      ...spacings.pvLg,
      justifyContent: isTab ? 'flex-start' : 'space-between',
      // Fixes huge gaps between rows
      alignContent: 'flex-start',
      ...commonWebStyles.contentContainer
    },
    noCollectibles: {
      textAlign: 'center',
      ...flexbox.flex1,
      ...spacings.mtXl
    }
  })

export default getStyles
