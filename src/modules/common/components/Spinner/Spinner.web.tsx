import React from 'react'
import { ActivityIndicator } from 'react-native'

// TODO: implement animated spinner on web (Lottie doesn't seem to work)
import colors from '@modules/common/styles/colors'

const Spinner = () => {
  return <ActivityIndicator color={colors.electricViolet} />
}

export default Spinner
