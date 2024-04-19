import React, { useEffect, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import { AccountPortfolio } from '@web/contexts/portfolioControllerStateContext'

import Collections from '../Collections'
import { TabType } from '../TabsAndSearch/Tabs/Tab/Tab'
import Tokens from '../Tokens'

interface Props {
  accountPortfolio: AccountPortfolio | null
  filterByNetworkId: NetworkDescriptor['id']
  tokenPreferences: CustomToken[]
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const DashboardPages = ({
  accountPortfolio,
  filterByNetworkId,
  tokenPreferences,
  onScroll
}: Props) => {
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

  return (
    <>
      <Tokens
        filterByNetworkId={filterByNetworkId}
        isLoading={!accountPortfolio?.isAllReady}
        tokenPreferences={tokenPreferences}
        openTab={openTab}
        setOpenTab={setOpenTab}
        onScroll={onScroll}
        initTab={initTab}
      />

      <Collections
        openTab={openTab}
        setOpenTab={setOpenTab}
        initTab={initTab}
        onScroll={onScroll}
      />
    </>
  )
}

export default React.memo(DashboardPages)
