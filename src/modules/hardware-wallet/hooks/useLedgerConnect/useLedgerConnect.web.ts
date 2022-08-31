// TODO: implement for web

import { useEffect, useState } from 'react'

import useToast from '@modules/common/hooks/useToast'

const useLedgerConnect = (shouldScan: boolean = true) => {
  const { addToast } = useToast()
  const [devices, setDevices] = useState<any>([])
  const [refreshing, setRefreshing] = useState<any>(true)

  let sub: any

  const startScan = async () => {
    setRefreshing(true)

    setTimeout(() => {
      sub.complete()
    }, 40000)
  }

  const reload = async () => {
    addToast('Not supported on Web')
    setRefreshing(false)
    startScan()
  }

  useEffect(() => {
    addToast('Not supported on Web')
  }, [shouldScan, addToast])

  return {
    devices,
    refreshing,
    reload
  }
}

export default useLedgerConnect
