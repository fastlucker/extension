import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'
import commonStyles from '@modules/common/styles/utils/common'

interface Style {
  container: ViewProps
}

const styles = StyleSheet.create<Style>({
  container: {
    borderWidth: 1,
    borderColor: colors.titan_25,
    ...commonStyles.borderRadiusPrimary
  }
})

export default styles
