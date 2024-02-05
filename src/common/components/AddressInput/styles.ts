import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

import getInputStyles from '../Input/styles'

interface Style {
  label: TextStyle
  domainIcons: ViewStyle
  plTy: ViewStyle
  button: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    label: {
      ...spacings.mbMi
    },
    domainIcons: flexbox.directionRow,
    plTy: spacings.plTy,
    button: getInputStyles(theme).button
  })

export default getStyles
