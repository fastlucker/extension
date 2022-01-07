import { StyleSheet, ViewStyle } from 'react-native'

interface Style {
  addNewAddressContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  addNewAddressContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center'
  }
})

export default styles
