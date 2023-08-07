import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

interface Style {
  textarea: ViewStyle
  searchSection: ViewStyle
  searchIcon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  textarea: {
    flex: 1,
    color: colors.martinique,
    paddingLeft: 10
  },
  searchSection: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.melrose_15,
    borderColor: colors.scampi_20,
    color: colors.martinique,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  searchIcon: {
    padding: 10
  }
})

export default styles
