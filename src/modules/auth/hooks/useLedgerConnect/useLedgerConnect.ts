import { useEffect, useState } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import { Observable } from 'rxjs'

import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import useToast from '@modules/common/hooks/useToast'

const deviceAddition = (device: any) => (devices: any) =>
  devices.some((i: any) => i.id === device.id) ? devices : devices.concat(device)

const useLedgerConnect = (shouldScan: boolean = true) => {
  const { addToast } = useToast()
  const [devices, setDevices] = useState<any>([])
  const [refreshing, setRefreshing] = useState<any>(false)
  const [isBluetoothPoweredOn, setInBluetoothPoweredOn] = useState(false)

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
      error: (e) => {
        // Timeout just for a better UX
        setTimeout(() => {
          addToast(e.message, { error: true })
          setRefreshing(false)
        }, 1200)
      }
    })

    setTimeout(() => {
      sub.complete()
    }, 40000)
  }

  const reload = async () => {
    if (sub) sub.unsubscribe()
    setRefreshing(false)
    startScan()
  }

  useEffect(() => {
    const subscription = new BleManager().onStateChange((state) => {
      setInBluetoothPoweredOn(state === 'PoweredOn')
    }, true)

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (!shouldScan || !isBluetoothPoweredOn) {
      if (sub) sub.unsubscribe()

      return
    }

    ;(async () => {
      // NB: this is the bare minimal. We recommend to implement a screen to explain to user.
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
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
  }, [shouldScan, isBluetoothPoweredOn])

  return {
    devices,
    refreshing,
    isBluetoothPoweredOn,
    reload
  }
}

export default useLedgerConnect
