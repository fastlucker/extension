import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import AddIcon from '@common/assets/svg/AddIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import NetworkIcon from '@common/components/NetworkIcon'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import getStyles from './styles'

const NetworksScreen = () => {
  const portfolioControllerState = usePortfolioControllerState()
  const { selectedAccount } = useMainControllerState()
  const { networks } = useSettingsControllerState()
  const { styles, theme } = useTheme(getStyles)

  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const search = watch('search')

  const portfolioByNetworks = useMemo(
    () => (selectedAccount ? portfolioControllerState.state.latest[selectedAccount] : {}),
    [selectedAccount, portfolioControllerState.state.latest]
  )

  const filteredAndSortedPortfolio = useMemo(
    () =>
      Object.keys(portfolioByNetworks || [])
        .filter((networkId) => {
          if (!search) return true
          const networkData = networks.find((network) => network.id === networkId)
          let networkName = networkData?.name
          if (networkId === 'rewards') {
            networkName = 'Ambire Rewards'
          }
          if (networkId === 'gasTank') {
            networkName = 'Gas Tank'
          }

          return networkName?.toLowerCase().includes(search.toLowerCase())
        })
        .sort((a, b) => {
          const aBalance = portfolioByNetworks[a]?.result?.total?.usd || 0
          const bBalance = portfolioByNetworks[b]?.result?.total?.usd || 0

          return Number(bBalance) - Number(aBalance)
        }),
    [networks, portfolioByNetworks, search]
  )

  return (
    <TabLayoutContainer
      header={<Header withPopupBackButton withAmbireLogo />}
      footer={<BackButton />}
      width="sm"
      hideFooterInPopup
    >
      <TabLayoutWrapperMainContent>
        <Search control={control} placeholder="Search" containerStyle={spacings.mb} />

        <View style={spacings.mbLg}>
          {!!selectedAccount &&
            filteredAndSortedPortfolio.map((networkId) => {
              const networkData = networks.find((network) => network.id === networkId)
              const networkBalance = portfolioByNetworks[networkId]?.result?.total
              let size = 32
              let networkName = networkData?.name

              if (networkId === 'rewards') {
                size = 20
                networkName = 'Ambire Rewards'
              } else if (networkId === 'gasTank') {
                size = 24
                networkName = 'Gas Tank'
              }

              return (
                <Pressable
                  key={networkId}
                  style={({ hovered }: any) => [
                    styles.network,
                    {
                      backgroundColor: hovered ? theme.secondaryBackground : theme.primaryBackground
                    }
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
                      <NetworkIcon width={size} height={size} name={networkId} />
                    </View>
                    <Text style={spacings.mlMi} fontSize={16}>
                      {networkName}
                    </Text>
                  </View>
                  <Text fontSize={16} weight="semiBold">
                    {`$${Number(networkBalance?.usd).toFixed(2)}` || '$-'}
                  </Text>
                </Pressable>
              )
            })}
        </View>

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
