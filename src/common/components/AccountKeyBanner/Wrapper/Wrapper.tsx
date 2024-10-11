import React from 'react'
import { View } from 'react-native'

import Badge from '@common/components/Badge'

const Wrapper = ({ text, children }: { text: string; children: React.ReactNode }) => {
  return (
    <Badge text={text}>
      <View>{children}</View>
    </Badge>
  )
}

export default React.memo(Wrapper)
