import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import AddIcon from '@common/assets/svg/AddIcon'
import NetworksIcon from '@common/assets/svg/NetworksIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { formatThousands } from '@common/modules/dashboard/helpers/getTokenDetails'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
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
  const { styles, theme } = useTheme(getStyles)
  const portfolioControllerState = usePortfolioControllerState()
  const { selectedAccount } = useMainControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const [selectedNetworkId, setSelectedNetworkId] = useState<NetworkDescriptor['id'] | null>(null)
  const search = watch('search')

  const openSettingsBottomSheet = (networkId: NetworkDescriptor['id']) => {
    openBottomSheet()
    setSelectedNetworkId(networkId)
  }

  const closeSettingsBottomSheet = () => {
    closeBottomSheet()
    setSelectedNetworkId(null)
  }

  const openBlockExplorer = async (networkId: NetworkDescriptor['id'], url?: string) => {
    const getNotANetworkMessage = (name: string) => {
      return `${name} is not a network and doesn't have a block explorer.`
    }
    if (networkId === 'rewards') {
      addToast(getNotANetworkMessage('Ambire Rewards'), {
        type: 'info'
      })
      return
    }
    if (networkId === 'gasTank') {
      addToast(getNotANetworkMessage('Gas Tank'), {
        type: 'info'
      })
      return
    }

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
      header={<Header withPopupBackButton withAmbireLogo />}
      footer={<BackButton />}
      width="sm"
      hideFooterInPopup
    >
      <TabLayoutWrapperMainContent>
        <NetworkBottomSheet
          sheetRef={sheetRef}
          closeBottomSheet={closeSettingsBottomSheet}
          selectedNetworkId={selectedNetworkId}
          openBlockExplorer={openBlockExplorer}
        />
        <Search control={control} placeholder="Search" containerStyle={spacings.mb} />
        <View style={[styles.network, styles.allNetworks]}>
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
          <Text fontSize={20} weight="semiBold">
            {`$${formatThousands(
              Number(portfolioControllerState.accountPortfolio?.totalAmount || 0).toFixed(2)
            )}` || '$-'}
          </Text>
        </View>
        <Networks
          openBlockExplorer={openBlockExplorer}
          openSettingsBottomSheet={openSettingsBottomSheet}
          search={search}
        />
        <Button disabled type="secondary">
          <AddIcon color={theme.primary} />
          <Text style={spacings.mlTy} fontSize={14} appearance="primary">
            Add New Network
          </Text>
        </Button>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default NetworksScreen
