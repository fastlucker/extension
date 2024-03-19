import { StyleSheet } from 'react-native'

import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

const getStyles = () =>
  StyleSheet.create({
    container: {
      width: 32,
      height: 32,
      ...flexbox.center,
      backgroundColor: '#14183326',
      borderRadius: BORDER_RADIUS_PRIMARY,
      borderWidth: 1
    }
  })

export default getStyles
