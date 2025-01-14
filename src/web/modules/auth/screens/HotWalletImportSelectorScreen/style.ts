import { StyleSheet } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create({
    warningModal: {
      width: 720,
      padding: 0,
      backgroundColor: theme.primaryBackground,
      paddingHorizontal: 0,
      paddingVertical: 0,
      overflow: 'hidden'
    }
  })

export default getStyles
