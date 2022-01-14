import React from 'react'
import { View } from 'react-native'

import Text from '@modules/common/components/Text'

function FailingTxn({ message, tooltip = '' }: any) {
  return (
    <View>
      {/* <AiOutlineWarning /> */}
      <Text>{message}</Text>
      {/* <FiHelpCircle title={tooltip} /> */}
    </View>
  )
}

export default FailingTxn
