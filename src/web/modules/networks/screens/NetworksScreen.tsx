import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { NetworkId } from '@ambire-common/interfaces/network'
import AddIcon from '@common/assets/svg/AddIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  tabLayoutWidths,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import Networks from '@web/modules/networks/components/Networks'

import AllNetworksOption from '../components/AllNetworksOption/AllNetworksOption'
import NetworkBottomSheet from '../components/NetworkBottomSheet'

const NetworksScreen = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { state } = useRoute()
  const { theme } = useTheme()
  const { navigate } = useNavigation()
  const { selectedAccount } = useAccountsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [selectedNetworkId, setSelectedNetworkId] = useState<NetworkId | null>(null)
  const filterByNetworkId = state?.filterByNetworkId || null

  const openSettingsBottomSheet = (networkId: NetworkId) => {
    openBottomSheet()
    setSelectedNetworkId(networkId)
  }

  const closeSettingsBottomSheet = () => {
    closeBottomSheet()
    setSelectedNetworkId(null)
  }

  const openBlockExplorer = async (url?: string) => {
    if (!url) {
      addToast(t('No block explorer available for this network'), {
        type: 'info'
      })
      return
    }

    try {
      await createTab(`${url}/address/${selectedAccount}`)
    } catch {
      addToast(t('Failed to open block explorer in a new tab.'), {
        type: 'info'
      })
    }
  }

  return (
    <TabLayoutContainer
      header={<Header customTitle="Networks" withPopupBackButton withAmbireLogo />}
      footer={<BackButton />}
      width="lg"
      hideFooterInPopup
    >
      <View style={[flexbox.flex1, spacings.pv]}>
        <TabLayoutWrapperMainContent>
          <NetworkBottomSheet
            sheetRef={sheetRef}
            closeBottomSheet={closeSettingsBottomSheet}
            selectedNetworkId={selectedNetworkId}
            openBlockExplorer={openBlockExplorer}
          />
          <AllNetworksOption filterByNetworkId={filterByNetworkId} />
          <Networks
            openBlockExplorer={openBlockExplorer}
            openSettingsBottomSheet={openSettingsBottomSheet}
            filterByNetworkId={filterByNetworkId}
          />
        </TabLayoutWrapperMainContent>
        <View style={[spacings.ptSm, { width: '100%' }]}>
          <Button
            text={t('Add New Network')}
            type="secondary"
            hasBottomSpacing={false}
            style={{ maxWidth: tabLayoutWidths.lg, ...flexbox.alignSelfCenter, width: '100%' }}
            childrenPosition="left"
            onPress={() => navigate(`${ROUTES.networksSettings}?addNetwork`)}
          >
            <AddIcon color={theme.primary} style={spacings.mrTy} />
          </Button>
        </View>
      </View>
    </TabLayoutContainer>
  )
}

export default NetworksScreen
