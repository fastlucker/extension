import { StyleSheet, ViewStyle } from 'react-native'

import { HEADER_HEIGHT } from '@common/modules/header/components/Header/styles'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  modalHeader: ViewStyle
  networkIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    modalHeader: {
      backgroundColor: theme.secondaryBackground,
      height: HEADER_HEIGHT,
      width: '100%',
      ...spacings.phXl,
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    networkIcon: {
      backgroundColor: theme.tertiaryBackground,
      ...spacings.mrTy
    }
  })

export default getStyles
