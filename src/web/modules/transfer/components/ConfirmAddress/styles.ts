import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  addToAddressBook: ViewStyle
  addToAddressBookIcon: ViewStyle
}

const styles = StyleSheet.create<Style>({
  addToAddressBook: { ...flexbox.directionRow, ...spacings.mb, opacity: 0.6 },
  addToAddressBookIcon: spacings.mrMi
})

export default styles
