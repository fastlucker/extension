import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'

interface Style {
  icon: ViewStyle
}

const getStyles = () =>
  StyleSheet.create<Style>({
    // @ts-ignore web style
    icon: { ...spacings.phTy, cursor: 'pointer' }
  })

export default getStyles
