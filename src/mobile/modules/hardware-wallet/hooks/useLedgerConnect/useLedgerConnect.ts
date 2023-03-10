import { useCallback, useEffect, useRef, useState } from 'react'
import { Subscription as ReactNativeBlePlxSubscription } from 'react-native-ble-plx'
import { Observable, Subscription as RxJSSubscription } from 'rxjs'

import useToast from '@common/hooks/useToast'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import { CONNECTION_TYPE } from '@mobile/modules/hardware-wallet/constants'

const SCAN_TIMEOUT = 40000 // 40 sec

const deviceAddition = (device: any) => (devices: any) =>
  devices.some((i: any) => i.id === device.id) ? devices : devices.concat(device)

const useLedgerConnect = (shouldScan: boolean = true) => {
  const { addToast } = useToast()
  const [devices, setDevices] = useState<any>([])
  const [refreshing, setRefreshing] = useState<any>(true)
  const sub = useRef<RxJSSubscription | null>(null)

  const startScan = useCallback(async () => {
    setRefreshing(true)
    sub.current = new Observable<ReactNativeBlePlxSubscription>(TransportBLE.listen).subscribe({
      complete: () => {
        setRefreshing(false)
      },
      next: (e: any) => {
        if (e.type === 'add') {
          setDevices(
            deviceAddition({
              ...e.descriptor,
              connectionType: CONNECTION_TYPE.BLUETOOTH
            })
          )
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

    // @ts-ignore the `complete` method exist, probably bad typings
    setTimeout(() => sub?.current?.complete(), SCAN_TIMEOUT)
  }, [addToast])

  const reload = async () => {
    if (sub.current) sub.current.unsubscribe()
    setRefreshing(false)
    startScan()
  }

  useEffect(() => {
    if (!shouldScan) {
      if (sub.current) sub.current.unsubscribe()

      return
    }

    startScan()

    return () => {
      if (sub.current) sub.current.unsubscribe()
    }
  }, [shouldScan, startScan])

  return {
    devices,
    refreshing,
    reload
  }
}

export default useLedgerConnect
