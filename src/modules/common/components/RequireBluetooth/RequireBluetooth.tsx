import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BleManager } from 'react-native-ble-plx'
import BluetoothStateManager from 'react-native-bluetooth-state-manager'

import { isAndroid } from '@config/env'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'

import RequireLocation from '../RequireLocation/RequireLocation'

const RequireBluetooth: React.FC = ({ children }) => {
  const { t } = useTranslation()
  const [isBluetoothPoweredOn, setInBluetoothPoweredOn] = useState<boolean | null>(null)

  useEffect(() => {
    const subscription = new BleManager().onStateChange((state) => {
      setInBluetoothPoweredOn(state === 'PoweredOn')
    }, true)

    return () => subscription.remove()
  }, [])

  const turnOnBluetooth = () => BluetoothStateManager.enable()

  // On Android only, location permission (ACCESS_FINE_LOCATION) also is needed.
  // This is because, on Android 11 and lower, a Bluetooth scan could
  // potentially be used to gather information about the location of the user.
  const state = isAndroid ? <RequireLocation>{children}</RequireLocation> : children

  return isBluetoothPoweredOn ? (
    state
  ) : (
    <>
      <P type={TEXT_TYPES.DANGER}>
        {t('Please turn on the Bluetooth first, in order to connect to hardware wallet devices.')}
      </P>
      <Button text={t('Turn on Bluetooth')} onPress={turnOnBluetooth} />
    </>
  )
}

export default RequireBluetooth
