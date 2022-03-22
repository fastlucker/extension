import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'

import TransportHID from '@ledgerhq/react-native-hid'
import useToast from '@modules/common/hooks/useToast'
import { CONNECTION_TYPE } from '@modules/hardware-wallet/constants'

const useHardwareWalletHIDConnect = () => {
  const { addToast } = useToast()
  const [device, setDevice] = useState<any>(null)
  const [refreshing, setRefreshing] = useState<any>(false)

  let sub: any

  const scan = async () => {
    setRefreshing(true)
    const isSupported = await TransportHID.isSupported()

    if (isSupported) {
      sub = new Observable(TransportHID.listen).subscribe({
        complete: () => {
          setRefreshing(false)
        },
        next: (e: any) => {
          if (e.type === 'add') {
            setDevice({
              ...e.descriptor,
              deviceName: e.deviceModel?.productName,
              name: e.deviceModel?.productName,
              connectionType: CONNECTION_TYPE.USB
            })
            sub.complete()
          }
        },
        error: (e) => {
          // Timeout just for a better UX
          setTimeout(() => {
            addToast(e.message, { error: true })
            setRefreshing(false)
          }, 1000)
        }
      })
    }
  }

  const reload = async () => {
    setRefreshing(false)
    scan()
  }

  useEffect(() => {
    setDevice(null)
    scan()

    return () => {
      if (sub) sub.unsubscribe()
    }
  }, [])

  return {
    device,
    refreshing,
    reload
  }
}

export default useHardwareWalletHIDConnect
