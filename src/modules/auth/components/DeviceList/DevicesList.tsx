import React from 'react'
import { View } from 'react-native'

import DeviceItem from '@modules/auth/components/DeviceItem'

const DevicesList = ({ onSelectDevice, devices }: any) => {
  return (
    <View>
      {devices.map((device: any) => (
        <DeviceItem device={device} onSelect={onSelectDevice} />
      ))}
    </View>
  )
}

export default DevicesList
