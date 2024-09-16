import { ethers } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { SOCKET_API_KEY } from '@env'
import { Bridge } from '@socket.tech/plugin'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import { ambireProvider } from '@web/extension-services/inpage/ambire-inpage'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useDappsControllerState from '@web/hooks/useDappsControllerState'

const SwapScreen = () => {
  const { theme } = useTheme()
  const [provider, setProvider] = useState<any | null>(null)
  const { dispatch } = useBackgroundService()
  const { state } = useDappsControllerState()

  const dapp = useMemo(() => {
    return state.dapps.find((d) => d.url === chrome.runtime.id)
  }, [state.dapps])

  useEffect(() => {
    window.ambire = ambireProvider
    setProvider(new ethers.BrowserProvider(window.ambire))
  }, [])

  // TODO: More customization options available, see:
  // https://docs.bungee.exchange/socket-plugin/customisation
  // https://sockettech.notion.site/Socket-PlugIn-Docs-b905871870e343c6833169ebbd356790#9909f2a61ea24637a2a1969a6944f56f
  const customize = {
    width: 440,
    responsiveWidth: false,
    borderRadius: 1,
    accent: 'rgb(96,0,255)',
    text: 'rgb(20,24,51)',
    secondaryText: 'rgb(84,89,122)',
    fontFamily: FONT_FAMILIES.REGULAR
  }

  const handleSourceNetworkChange = useCallback(
    (network: any) => {
      dispatch({
        type: 'DAPP_CONTROLLER_UPDATE_DAPP',
        params: { url: chrome.runtime.id, dapp: { chainId: network.chainId } }
      })
    },
    [dispatch]
  )

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="xl"
      header={<HeaderAccountAndNetworkInfo />}
    >
      <TabLayoutWrapperMainContent contentContainerStyle={spacings.pt2Xl}>
        <View style={flexbox.alignSelfCenter}>
          {!!provider && (
            <Bridge
              customize={customize}
              provider={provider}
              API_KEY={SOCKET_API_KEY}
              onSourceNetworkChange={handleSourceNetworkChange}
              singleTxOnly={false}
              defaultSourceNetwork={dapp?.chainId || 1}
            />
          )}
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(SwapScreen)
