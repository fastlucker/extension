import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useTranslation } from '@config/localization'
import DeviceItem from '@modules/auth/components/DeviceItem'
import Button, { BUTTON_SIZES } from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const DevicesList = ({ onSelectDevice, devices, refreshing, onRefresh }: any) => {
  const { t } = useTranslation()
  return (
    <>
      {!!devices.length && (
        <View style={flexboxStyles.flex1}>
          {devices.map((device: any) => (
            <DeviceItem key={device.id} device={device} onSelect={onSelectDevice} />
          ))}
        </View>
      )}
      {!devices.length && !refreshing && (
        <View
          style={[StyleSheet.absoluteFill, flexboxStyles.alignCenter, flexboxStyles.justifyCenter]}
        >
          <Text fontSize={18} style={spacings.mbTy}>
            {t('No devices found')}
          </Text>
          <View>
            <Button size={BUTTON_SIZES.SMALL} text={t('Scan')} onPress={onRefresh} />
          </View>
        </View>
      )}
    </>
  )
}

export default DevicesList
