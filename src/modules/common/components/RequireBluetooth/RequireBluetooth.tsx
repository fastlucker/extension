import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BleManager } from 'react-native-ble-plx'

import P from '@modules/common/components/P'

import { TEXT_TYPES } from '../Text'

const RequireBluetooth: React.FC = ({ children }) => {
  const { t } = useTranslation()
  const [isBluetoothPoweredOn, setInBluetoothPoweredOn] = useState<boolean | null>(null)

  useEffect(() => {
    const subscription = new BleManager().onStateChange((state) => {
      setInBluetoothPoweredOn(state === 'PoweredOn')
    }, true)

    return () => subscription.remove()
  }, [])

  return isBluetoothPoweredOn ? (
    children
  ) : (
    <P type={TEXT_TYPES.DANGER}>{t('Please enable the Bluetooth first!')}</P>
  )
}

export default RequireBluetooth
