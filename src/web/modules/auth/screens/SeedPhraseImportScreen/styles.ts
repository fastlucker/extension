import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

type Styles = {
  errorText: ViewStyle
  passphraseContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    errorText: {
      ...spacings.phMi,
      ...spacings.mbMI,
      ...spacings.phTy,
      paddingTop: SPACING_MI / 2
    },
    passphraseContainer: {
      borderTopWidth: 1,
      borderTopColor: theme.secondaryBorder,
      ...spacings.ptLg,
      ...flexbox.directionRow,
      ...flexbox.alignStart
    }
  })

export default getStyles
