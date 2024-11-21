import React, { useEffect, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'

import { NetworkId } from '@ambire-common/interfaces/network'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import { getUiType } from '@web/utils/uiType'

import Collections from '../Collections'
import DeFiPositions from '../DeFiPositions'
import Activity from '../Activity'
import { TabType } from '../TabsAndSearch/Tabs/Tab/Tab'
import Tokens from '../Tokens'

interface Props {
  filterByNetworkId: NetworkId
  tokenPreferences: CustomToken[]
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const { isTab } = getUiType()

const DashboardPages = ({ filterByNetworkId, tokenPreferences, onScroll }: Props) => {
  const route = useRoute()

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
  const { networks } = useNetworksControllerState()
  return (
    <View style={[flexbox.flex1, isTab ? spacings.phSm : {}]}>
      <Tokens
        filterByNetworkId={filterByNetworkId}
        tokenPreferences={tokenPreferences}
        openTab={openTab}
        setOpenTab={setOpenTab}
        onScroll={onScroll}
        initTab={initTab}
      />
      <Collections
        filterByNetworkId={filterByNetworkId}
        openTab={openTab}
        setOpenTab={setOpenTab}
        initTab={initTab}
        onScroll={onScroll}
        networks={networks}
      />

      <DeFiPositions
        filterByNetworkId={filterByNetworkId}
        openTab={openTab}
        setOpenTab={setOpenTab}
        onScroll={onScroll}
        initTab={initTab}
      />

      <Activity
        filterByNetworkId={filterByNetworkId}
        openTab={openTab}
        setOpenTab={setOpenTab}
        onScroll={onScroll}
        initTab={initTab}
      />
    </View>
  )
}

export default React.memo(DashboardPages)
