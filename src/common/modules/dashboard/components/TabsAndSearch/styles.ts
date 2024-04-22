import { StyleSheet } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

const styles = StyleSheet.create({
  container: {
    ...commonWebStyles.contentContainer,
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween,
    ...flexbox.alignCenter,
    ...spacings.mb
  }
})

export default styles
