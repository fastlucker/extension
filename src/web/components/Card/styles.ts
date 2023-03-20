import { StyleSheet, ViewProps } from 'react-native'
import { TextProps } from 'react-native-svg'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

interface Style {
  container: ViewProps
  text: TextProps
}

const styles = StyleSheet.create<Style>({
  container: {
    width: 320,
    backgroundColor: colors.melrose_15,
    borderWidth: 1,
    borderColor: colors.scampi_20,
    borderRadius: 12,
    ...spacings.ph,
    ...spacings.pv
  },
  text: {
    textAlign: 'center',
    marginBottom: 30
  }
})

export default styles
