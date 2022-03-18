import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BleManager } from 'react-native-ble-plx'
import BluetoothStateManager from 'react-native-bluetooth-state-manager'

import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import { TEXT_TYPES } from '@modules/common/components/Text'

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

  return isBluetoothPoweredOn ? (
    children
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
