import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import BluetoothStateManager from 'react-native-bluetooth-state-manager'

import { isAndroid } from '@config/env'
import Button from '@modules/common/components/Button'
import RequireLocation from '@modules/common/components/RequireLocation'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'

const RequireBluetooth: React.FC<any> = ({ children }) => {
  const { t } = useTranslation()
  const [isBluetoothTurningOn, setIsBluetoothTurningOn] = useState(false)
  const [isBluetoothPoweredOn, setInBluetoothPoweredOn] = useState<boolean | null>(null)

  useEffect(() => {
    const subscription = new BleManager().onStateChange((state) => {
      setInBluetoothPoweredOn(state === 'PoweredOn')
      // On state change, assume that the module is no longer in process of
      // being turned on. Delay it a bit, otherwise, there is annoying UI jump.
      setTimeout(() => setIsBluetoothTurningOn(false), 1000)
    }, true)
    return () => subscription.remove()
  }, [])

  const turnOnBluetooth = () => {
    setIsBluetoothTurningOn(true)
    BluetoothStateManager.enable()
  }

  // On Android only, location permission (ACCESS_FINE_LOCATION) also is needed.
  // This is because, on Android 11 and lower, a Bluetooth scan could
  // potentially be used to gather information about the location of the user.
  const state = isAndroid ? <RequireLocation>{children}</RequireLocation> : children

  return isBluetoothPoweredOn ? (
    state
  ) : (
    <View style={[spacings.ph]}>
      <Text style={spacings.mbSm} fontSize={12}>
        {t('Please turn on Bluetooth first, in order to connect to hardware wallet devices.')}
      </Text>
      {isAndroid && (
        <Button
          disabled={isBluetoothTurningOn}
          text={isBluetoothTurningOn ? t('Turning on...') : t('Turn on Bluetooth')}
          onPress={turnOnBluetooth}
        />
      )}
    </View>
  )
}

export default RequireBluetooth
