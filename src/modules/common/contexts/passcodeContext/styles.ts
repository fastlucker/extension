import { StyleSheet, ViewProps } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Styles {
  lockedContainer: ViewProps
}

const styles = StyleSheet.create<Styles>({
  lockedContainer: {
    backgroundColor: colors.secondaryAccentColor
  }
})

export default styles
