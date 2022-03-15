import React, { useState } from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import Text from '@modules/common/components/Text'

const DeviceItem = ({ device, onSelect }: any) => {
  const [pending, setPending] = useState(false)

  const handleSelectDevice = async () => {
    setPending(true)
    try {
      await onSelect(device)
    } finally {
      setPending(false)
    }
  }
  return (
    <TouchableOpacity
      onPress={handleSelectDevice}
      style={{
        padding: 10,
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <Text>{device?.name}</Text>
      {pending ? <ActivityIndicator /> : null}
    </TouchableOpacity>
  )
}

export default DeviceItem
