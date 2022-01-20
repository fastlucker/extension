import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import CONFIG from '@config/env'
import useAccounts from '@modules/common/hooks/useAccounts'
import { fetchCaught } from '@modules/common/services/fetch'

// 250ms after we've triggered a load of another URL, we will clear the data
//  so that the component that uses this hook cann display the loading spinner
const RESET_DATA_AFTER = 250

type RelayerData = {
  data: any
  isLoading: boolean
  errMsg: any
  url: string
}

const RelayerDataContext = createContext<RelayerData>({
  data: null,
  isLoading: true,
  errMsg: null,
  url: ''
})

const RelayerDataProvider: React.FC = ({ children }) => {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const prevUrl = useRef('')
  const { selectedAcc } = useAccounts()
  const [cacheBreak, setCacheBreak] = useState(() => Date.now())

  useEffect(() => {
    if (Date.now() - cacheBreak > 5000) setCacheBreak(Date.now())
    const intvl = setTimeout(() => setCacheBreak(Date.now()), 30000)
    return () => clearTimeout(intvl)
  }, [cacheBreak])

  const url =
    CONFIG.RELAYER_URL && selectedAcc
      ? `${CONFIG.RELAYER_URL}/wallet-token/rewards/${selectedAcc}?cacheBreak=${cacheBreak}`
      : null

  const updateData = useCallback(async () => {
    const { resp, body, errMsg } = await fetchCaught(url, {})

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
    let resetDataTimer = null
    const stripQuery = (x) => x.split('?')[0]
    if (stripQuery(prevUrl.current) !== stripQuery(url)) {
      resetDataTimer = setTimeout(() => setData(null), RESET_DATA_AFTER)
    }
    prevUrl.current = url

    let unloaded = false
    setLoading(true)
    setErr(null)
    updateData()
      .then((data) => !unloaded && prevUrl.current === url && setData(data))
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

  return (
    <RelayerDataContext.Provider
      value={useMemo(
        () => ({
          data,
          isLoading,
          errMsg: err,
          url
        }),
        [data, isLoading, err]
      )}
    >
      {children}
    </RelayerDataContext.Provider>
  )
}

export { RelayerDataContext, RelayerDataProvider }
