import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import AddIcon from '@common/assets/svg/AddIcon'
import NetworksIcon from '@common/assets/svg/NetworksIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { formatThousands } from '@common/modules/dashboard/helpers/getTokenDetails'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  tabLayoutWidths,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { createTab } from '@web/extension-services/background/webapi/tab'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import Networks from '@web/modules/networks/components/Networks'

import NetworkBottomSheet from '../components/NetworkBottomSheet'
import getStyles from './styles'

const NetworksScreen = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { navigate } = useNavigation()
  const { state } = useRoute()
  const { styles, theme } = useTheme(getStyles)
  const portfolioControllerState = usePortfolioControllerState()
  const { selectedAccount } = useMainControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [selectedNetworkId, setSelectedNetworkId] = useState<NetworkDescriptor['id'] | null>(null)
  const filterByNetworkId = state?.filterByNetworkId || null

  const openSettingsBottomSheet = (networkId: NetworkDescriptor['id']) => {
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
          <Pressable
            onPress={() => {
              navigate(WEB_ROUTES.dashboard, {
                state: {
                  filterByNetworkId: null
                }
              })
            }}
            style={({ hovered }: any) => [
              styles.network,
              styles.noKebabNetwork,
              !filterByNetworkId || hovered ? styles.highlightedNetwork : {}
            ]}
          >
            <View style={[flexbox.alignCenter, flexbox.directionRow]}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  ...flexbox.center
                }}
              >
                {/* @ts-ignore */}
                <NetworksIcon width={20} height={20} />
              </View>
              <Text style={spacings.mlMi} fontSize={16}>
                {t('All Networks')}
              </Text>
            </View>
            <Text fontSize={!filterByNetworkId ? 20 : 16} weight="semiBold">
              {`$${formatThousands(
                Number(portfolioControllerState.accountPortfolio?.totalAmount || 0).toFixed(2)
              )}` || '$-'}
            </Text>
          </Pressable>
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
            disabled
          >
            <AddIcon color={theme.primary} style={spacings.mrTy} />
          </Button>
        </View>
      </View>
    </TabLayoutContainer>
  )
}

export default NetworksScreen
