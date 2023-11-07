import { StyleSheet } from 'react-native'

import getInputStyles, { Style as StyleInterface } from '@common/components/Input/styles'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<StyleInterface>({
    ...getInputStyles(theme),
    inputWrapper: {
      ...getInputStyles(theme).inputWrapper,
      height: 'auto'
    },
    input: {
      ...getInputStyles(theme).input,
      ...spacings.pv,
      height: 'auto'
    }
  })

export default getStyles
