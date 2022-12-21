import { StyleSheet, ViewProps } from 'react-native'

interface Styles {
  lockedContainer: ViewProps
}

const styles = StyleSheet.create<Styles>({
  lockedContainer: {
    // The lock container should come on top of everything
    zIndex: 1000,
    elevation: 100
  }
})

export default styles
