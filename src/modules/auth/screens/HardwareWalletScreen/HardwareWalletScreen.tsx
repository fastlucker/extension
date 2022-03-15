/* eslint-disable no-await-in-loop */
import React, { useEffect, useRef, useState } from 'react'

import { useTranslation } from '@config/localization'
import AppEth from '@ledgerhq/hw-app-eth'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'
import usePrevious from '@modules/common/hooks/usePrevious'

import DeviceSelection from './DeviceSelection'

// eslint-disable-next-line no-promise-executor-return
const delay = (ms: number) => new Promise((success) => setTimeout(success, ms))

const HardwareWalletScreen = () => {
  const { t } = useTranslation()
  const [transport, setTransport] = useState<any>(null)
  const [address, setAddress] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const unmounted = useRef<null | boolean>(null)
  const prevTransport = usePrevious(transport)

  const fetchAddress = async (verify) => {
    try {
      const eth = new AppEth(transport)
      const path = "44'/60'/0'/0/0" // HD derivation path
      const { address: adr } = await eth.getAddress(path, verify)
      if (unmounted.current) return
      setAddress(adr)
    } catch (err) {
      // in this case, user is likely not on Ethereum app
      if (unmounted.current) return
      setError(err)
      return null
    }
  }

  useEffect(() => {
    ;(async () => {
      if (!prevTransport && transport) {
        while (!address) {
          if (unmounted.current) return
          await fetchAddress(false)
          await delay(500)
        }
        await fetchAddress(true)
      }
    })()

    return () => {
      unmounted.current = true
    }
  }, [transport, prevTransport])

  const onSelectDevice = async (device: any) => {
    const transportBLE = await TransportBLE.open(device)
    transportBLE.on('disconnect', () => {
      // Intentionally for the sake of simplicity we use a transport local state
      // and remove it on disconnect.
      // A better way is to pass in the device.id and handle the connection internally.

      setTransport(null)
    })
    setTransport(transportBLE)
  }

  console.log('address', address)

  return <>{!transport && <DeviceSelection onSelectDevice={onSelectDevice} />}</>
}

export default HardwareWalletScreen
