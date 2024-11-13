import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { NetworkId } from '@ambire-common/interfaces/network'
import AddIcon from '@common/assets/svg/AddIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  tabLayoutWidths,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import Networks from '@web/modules/networks/components/Networks'

import AddNetworkBottomSheet from '../components/AddNetworkBottomSheet'
import AllNetworksOption from '../components/AllNetworksOption/AllNetworksOption'
import NetworkBottomSheet from '../components/NetworkBottomSheet'

const NetworksScreen = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { state } = useRoute()
  const { theme } = useTheme()
  const { account } = useSelectedAccountControllerState()
  const {
    ref: settingsBottomSheetRef,
    open: openSettingsBottomSheet,
    close: closeSettingsBottomSheet
  } = useModalize()
  const {
    ref: addNetworkBottomSheetRef,
    open: openAddNetworkBottomSheet,
    close: closeAddNetworkBottomSheet
  } = useModalize()
  const [search, setSearch] = useState('')
  const [selectedNetworkId, setSelectedNetworkId] = useState<NetworkId | null>(null)
  const filterByNetworkId = state?.filterByNetworkId || null

  const openSettingsBottomSheetWrapped = (networkId: NetworkId) => {
    openSettingsBottomSheet()
    setSelectedNetworkId(networkId)
  }

  const closeSettingsBottomSheetWrapped = () => {
    closeSettingsBottomSheet()
    setSelectedNetworkId(null)
  }

  const openAddNetworkBottomSheetWrapped = () => {
    openAddNetworkBottomSheet()
  }

  const openBlockExplorer = async (url?: string) => {
    if (!url) {
      addToast(t('No block explorer available for this network'), {
        type: 'info'
      })
      return
    }

    try {
      await createTab(`${url}/address/${account?.addr}`)
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
      <View style={[flexbox.flex1, spacings.pb]}>
        <TabLayoutWrapperMainContent>
          <NetworkBottomSheet
            sheetRef={settingsBottomSheetRef}
            closeBottomSheet={closeSettingsBottomSheetWrapped}
            selectedNetworkId={selectedNetworkId}
            openBlockExplorer={openBlockExplorer}
          />
          <AddNetworkBottomSheet
            sheetRef={addNetworkBottomSheetRef}
            closeBottomSheet={closeAddNetworkBottomSheet}
          />
          <Input
            autoFocus
            containerStyle={spacings.mb}
            value={search}
            onChangeText={setSearch}
            placeholder={t('Search for network')}
          />
          <AllNetworksOption filterByNetworkId={filterByNetworkId} />
          <Networks
            search={search}
            openBlockExplorer={openBlockExplorer}
            openSettingsBottomSheet={openSettingsBottomSheetWrapped}
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
            onPress={openAddNetworkBottomSheetWrapped}
          >
            <AddIcon color={theme.primary} style={spacings.mrTy} />
          </Button>
        </View>
      </View>
    </TabLayoutContainer>
  )
}

export default React.memo(NetworksScreen)
