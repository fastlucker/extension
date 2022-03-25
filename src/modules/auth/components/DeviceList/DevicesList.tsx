import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import DeviceItem from '@modules/auth/components/DeviceItem'
import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'

const DevicesList = ({ onSelectDevice, devices, refreshing, onRefresh }: any) => {
  const { t } = useTranslation()

  return (
    <>
      {!!devices.length && (
        <View>
          {devices.map((device: any) => (
            <DeviceItem key={device.id} device={device} onSelect={onSelectDevice} />
          ))}
        </View>
      )}
      {!devices.length && !refreshing && (
        <View style={spacings.mv}>
          <Text fontSize={18} style={spacings.mbTy}>
            {t('No devices found')}
          </Text>
          <Button text={t('Scan')} onPress={onRefresh} />
        </View>
      )}
    </>
  )
}

export default DevicesList
