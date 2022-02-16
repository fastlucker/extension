import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchCaught } from '@modules/common/services/fetch'

// 250ms after we've triggered a load of another URL, we will clear the data
//  so that the component that uses this hook cann display the loading spinner
const RESET_DATA_AFTER = 250

export default function useRelayerData(url: string | null) {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<any>(null)
  const [err, setErr] = useState<any>(null)
  const prevUrl = useRef('')

  const updateData = useCallback(async () => {
    const { resp, body, errMsg } = await fetchCaught(url)

    if (resp && resp.status === 200) {
      return body
    }
    console.log('relayerData error', { resp, body, errMsg })
    throw new Error(errMsg || `status code ${resp && resp.status}`)
  }, [url])

  useEffect(() => {
    if (!url) return

    // Data reset: if some time passes before we load the next piece of data, and the URL is different,
    // we will reset the data so that the UI knows to display a loading indicator
    let resetDataTimer: any = null
    const stripQuery = (x: any) => x.split('?')[0]
    if (stripQuery(prevUrl.current) !== stripQuery(url)) {
      resetDataTimer = setTimeout(() => setData(null), RESET_DATA_AFTER)
    }
    prevUrl.current = url

    let unloaded = false
    setLoading(true)
    setErr(null)
    updateData()
      .then((d: any) => !unloaded && prevUrl.current === url && setData(d))
      .catch((e) => !unloaded && setErr(e.message || e))
      .then(() => {
        clearTimeout(resetDataTimer)
        !unloaded && setLoading(false)
      })
    return () => {
      unloaded = true
      clearTimeout(resetDataTimer)
    }
  }, [url, updateData])

  return { data, isLoading, errMsg: err }
}
