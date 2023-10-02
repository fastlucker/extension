import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  rejectButton: ViewStyle
  addMoreTxnButton: ViewStyle
  signButton: ViewStyle
}

const button = {
  width: 230,
  height: 66,
  marginBottom: 0
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...spacings.phLg,
      backgroundColor: theme.secondaryBackground,
      paddingVertical: 20
    },
    rejectButton: {
      ...button,
      backgroundColor: theme.secondaryBackground
    },
    addMoreTxnButton: {
      ...button,
      marginRight: 24
    },
    signButton: {
      ...button
    }
  })

export default getStyles
