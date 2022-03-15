import React, { useEffect, useState } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import { Observable } from 'rxjs'

import { useTranslation } from '@config/localization'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'

import DeviceItem from './DeviceItem'

const deviceAddition = (device: any) => (devices: any) =>
  devices.some((i: any) => i.id === device.id) ? devices : devices.concat(device)

const DeviceSelection = ({ onSelectDevice }: any) => {
  const { t } = useTranslation()
  const [devices, setDevices] = useState<any>([])
  const [error, setError] = useState<any>(null)
  const [refreshing, setRefreshing] = useState<any>(false)

  let sub: any

  const startScan = async () => {
    setRefreshing(true)
    sub = new Observable(TransportBLE.listen).subscribe({
      complete: () => {
        setRefreshing(false)
      },
      next: (e: any) => {
        if (e.type === 'add') {
          setDevices(deviceAddition(e.descriptor))
        }
      },
      error: (e: any) => {
        setRefreshing(false)
        setError(e)
      }
    })
  }

  const reload = async () => {
    if (sub) sub.unsubscribe()
    setDevices([])
    setError(null)
    setRefreshing(false)
    startScan()
  }

  useEffect(() => {
    ;(async () => {
      // NB: this is the bare minimal. We recommend to implement a screen to explain to user.
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
      }
      let previousAvailable = false
      new Observable(TransportBLE.observeState).subscribe((e: any) => {
        if (e.available !== previousAvailable) {
          previousAvailable = e.available
          if (e.available) {
            reload()
          }
        }
      })

      startScan()
    })()

    return () => {
      if (sub) sub.unsubscribe()
    }
  }, [])

  const keyExtractor = (item: any) => item.id

  const renderItem = ({ item }: any) => {
    return <DeviceItem device={item} onSelect={onSelectDevice} />
  }

  return (
    <Wrapper
      type={WRAPPER_TYPES.FLAT_LIST}
      extraData={error}
      data={devices}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
}

export default DeviceSelection
