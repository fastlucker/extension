import { nanoid } from 'nanoid'
import React, { useEffect, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { useSearchParams } from 'react-router-dom'

import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import { getUiType } from '@web/utils/uiType'

import Activity from '../Activity'
import Collections from '../Collections'
import DeFiPositions from '../DeFiPositions'
import { TabType } from '../TabsAndSearch/Tabs/Tab/Tab'
import Tokens from '../Tokens'

interface Props {
  tokenPreferences: CustomToken[]
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const { isTab } = getUiType()

const DashboardPages = ({ tokenPreferences, onScroll }: Props) => {
  const route = useRoute()
  const [sessionId] = useState(nanoid())
  const [, setSearchParams] = useSearchParams()
  const { networks } = useNetworksControllerState()
  const { dispatch } = useBackgroundService()

  const [openTab, setOpenTab] = useState(() => {
    const params = new URLSearchParams(route?.search)

    return (params.get('tab') as TabType) || 'tokens'
  })
  const prevOpenTab = usePrevious(openTab)
  // To prevent initial load of all tabs but load them when requested by the user
  // Persist the rendered list of items for each tab once opened
  // This technique improves the initial loading speed of the dashboard
  const [initTab, setInitTab] = useState<{
    [key: string]: boolean
  }>({})

  useEffect(() => {
    if (openTab !== prevOpenTab && !initTab?.[openTab]) {
      setInitTab((prev) => ({ ...prev, [openTab]: true }))
    }
  }, [openTab, prevOpenTab, initTab])

  useEffect(() => {
    // Initialize the port session. This is necessary to automatically terminate the session when the tab is closed.
    // The process is managed in the background using port.onDisconnect,
    // as there is no reliable window event triggered when a tab is closed.
    setSearchParams((prev) => {
      prev.set('sessionId', sessionId)
      return prev
    })

    return () => {
      // Remove session - this will be triggered only when navigation to another screen internally in the extension.
      // The session removal when the window is forcefully closed is handled
      // in the port.onDisconnect callback in the background.
      dispatch({ type: 'MAIN_CONTROLLER_ACTIVITY_RESET_ACC_OPS_FILTERS', params: { sessionId } })
    }
  }, [dispatch, sessionId, setSearchParams])

  return (
    <View style={[flexbox.flex1, isTab ? spacings.phSm : {}]}>
      <Tokens
        tokenPreferences={tokenPreferences}
        openTab={openTab}
        sessionId={sessionId}
        setOpenTab={setOpenTab}
        onScroll={onScroll}
        initTab={initTab}
      />
      <Collections
        openTab={openTab}
        sessionId={sessionId}
        setOpenTab={setOpenTab}
        initTab={initTab}
        onScroll={onScroll}
        networks={networks}
      />

      <DeFiPositions
        openTab={openTab}
        sessionId={sessionId}
        setOpenTab={setOpenTab}
        onScroll={onScroll}
        initTab={initTab}
      />

      <Activity
        openTab={openTab}
        sessionId={sessionId}
        setOpenTab={setOpenTab}
        onScroll={onScroll}
        initTab={initTab}
      />
    </View>
  )
}

export default React.memo(DashboardPages)
