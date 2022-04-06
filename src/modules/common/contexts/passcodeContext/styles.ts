import { StyleSheet, ViewProps } from 'react-native'

import colors from '@modules/common/styles/colors'

interface Styles {
  lockedContainer: ViewProps
}

const styles = StyleSheet.create<Styles>({
  lockedContainer: {
    backgroundColor: colors.secondaryAccentColor,
    // The lock container should come on top of everything
    zIndex: 1000,
    elevation: 100
  }
})

export default styles
