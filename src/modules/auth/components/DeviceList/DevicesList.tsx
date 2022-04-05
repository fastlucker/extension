import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import DeviceItem from '@modules/auth/components/DeviceItem'
import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'

import styles from './styles'

const DevicesList = ({ onSelectDevice, devices, refreshing, onRefresh }: any) => {
  const { t } = useTranslation()

  return (
    <View style={styles.deviceItemsContainer}>
      {!!devices.length &&
        devices.map((device: any) => (
          <DeviceItem key={device.id} device={device} onSelect={onSelectDevice} />
        ))}
      {!devices.length && !refreshing && (
        <View style={[spacings.mtLg, spacings.mbMd]}>
          <Text fontSize={14} style={spacings.mbSm}>
            {t('No devices found')}
          </Text>
          <Button text={t('Scan')} onPress={onRefresh} />
        </View>
      )}
    </View>
  )
}

export default DevicesList
