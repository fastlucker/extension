import { StyleSheet, ViewProps } from 'react-native'

import { colorPalette as colors } from '@modules/common/styles/colors'

interface Styles {
  lockedContainerAndroid: ViewProps
  lockedContainer: ViewProps
}

const styles = StyleSheet.create<Styles>({
  lockedContainerAndroid: {
    backgroundColor: colors.howl
  },
  lockedContainer: {
    // The lock container should come on top of everything
    zIndex: 1000,
    elevation: 100
  }
})

export default styles
