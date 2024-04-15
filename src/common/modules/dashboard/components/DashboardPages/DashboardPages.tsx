import React, { useEffect, useMemo, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ViewStyle } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import { AccountPortfolio } from '@web/contexts/portfolioControllerStateContext'
import commonWebStyles from '@web/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

import useBanners from '../../hooks/useBanners'
import Collections from '../Collections'
import { TabType } from '../TabsAndSearch/Tabs/Tab/Tab'
import Tokens from '../Tokens'

interface Props {
  accountPortfolio: AccountPortfolio | null
  filterByNetworkId: NetworkDescriptor['id']
  tokenPreferences: CustomToken[]
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

// We do this instead of unmounting the component to prevent component rerendering when switching tabs.
const HIDDEN_STYLE: ViewStyle = {
  position: 'absolute',
  opacity: 0,
  display: 'none',
  // @ts-ignore
  pointerEvents: 'none'
}

const getFlatListStyle = (tab: TabType, openTab: TabType, allBannersLength: number) => [
  spacings.ph0,
  commonWebStyles.contentContainer,
  !allBannersLength && spacings.mtTy,
  openTab !== tab ? HIDDEN_STYLE : {}
]

const { isPopup } = getUiType()

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

  const allBanners = useBanners()

  useEffect(() => {
    if (openTab !== prevOpenTab && !initTab?.[openTab]) {
      setInitTab((prev) => ({ ...prev, [openTab]: true }))
    }
  }, [openTab, prevOpenTab, initTab])

  const contentContainerStyle = useMemo(
    () => [
      isPopup && spacings.phSm,
      isPopup && spacings.prTy,
      allBanners.length ? spacings.ptTy : spacings.pt0,
      { flexGrow: 1 }
    ],
    [allBanners.length]
  )

  const tokensStyle = useMemo(
    () => getFlatListStyle('tokens', openTab, allBanners.length),
    [allBanners.length, openTab]
  )

  const collectiblesStyle = useMemo(
    () => getFlatListStyle('collectibles', openTab, allBanners.length),
    [allBanners.length, openTab]
  )

  return (
    <>
      <Tokens
        filterByNetworkId={filterByNetworkId}
        isLoading={!accountPortfolio?.isAllReady}
        tokenPreferences={tokenPreferences}
        openTab={openTab}
        setOpenTab={setOpenTab}
        style={tokensStyle}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        initTab={initTab}
      />

      <Collections
        style={collectiblesStyle}
        contentContainerStyle={contentContainerStyle}
        openTab={openTab}
        setOpenTab={setOpenTab}
        initTab={initTab}
        onScroll={onScroll}
      />
    </>
  )
}

export default React.memo(DashboardPages)
