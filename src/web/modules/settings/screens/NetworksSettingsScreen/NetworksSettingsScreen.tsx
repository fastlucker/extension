import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { NetworkDescriptor, NetworkFeature } from '@ambire-common/interfaces/networkDescriptor'
import { getFeatures } from '@ambire-common/libs/settings/settings'
import AddIcon from '@common/assets/svg/AddIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import NetworkAvailableFeatures from '@web/components/NetworkAvailableFeatures'
import NetworkDetails from '@web/components/NetworkDetails'
import { tabLayoutWidths } from '@web/components/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'
import { SettingsRoutesContext } from '@web/modules/settings/contexts/SettingsRoutesContext'
import { getAreDefaultsChanged } from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm/helpers'

import Network from './Network'
import NetworkForm from './NetworkForm'

const NetworksSettingsScreen = () => {
  const { t } = useTranslation()
  const { search: searchParams } = useRoute()
  const { control, watch } = useForm({ defaultValues: { search: '' } })
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [features, setFeatures] = useState<NetworkFeature[]>(getFeatures(undefined))
  const { dispatch } = useBackgroundService()
  const { maxWidthSize } = useWindowSize()
  const { networks, networkToAddOrUpdate } = useSettingsControllerState()

  const search = watch('search')
  const [selectedNetworkId, setSelectedNetworkId] = useState(() => {
    const parsedSearchParams = new URLSearchParams(searchParams)

    if (parsedSearchParams.has('networkId')) {
      return parsedSearchParams.get('networkId') as string
    }

    return undefined
  })

  const selectedNetwork = useMemo(
    () => networks.find((network) => network.id === selectedNetworkId),
    [networks, selectedNetworkId]
  )

  useEffect(() => {
    if (networkToAddOrUpdate?.info) {
      const featuresRes = getFeatures(networkToAddOrUpdate?.info)
      setFeatures(featuresRes)
    }
  }, [networkToAddOrUpdate?.info])

  const networkForm = useForm({
    // Mode onChange is required to validate the rpcUrl field, because custom errors
    // are overwritten by errors from the rules.
    mode: 'onChange',
    defaultValues: {
      name: '',
      rpcUrl: '',
      chainId: '',
      nativeAssetSymbol: '',
      explorerUrl: ''
    },
    values: {
      name: selectedNetwork?.name || '',
      rpcUrl: selectedNetwork?.rpcUrl || '',
      chainId: Number(selectedNetwork?.chainId) || '',
      nativeAssetSymbol: selectedNetwork?.nativeAssetSymbol || '',
      explorerUrl: selectedNetwork?.explorerUrl || ''
    }
  })

  const { setCurrentSettingsPage } = useContext(SettingsRoutesContext)

  useEffect(() => {
    setCurrentSettingsPage('networks')
  }, [setCurrentSettingsPage])

  const networkFormValues = networkForm.watch()

  const filteredNetworkBySearch = networks.filter((network) =>
    network.name.toLowerCase().includes(search.toLowerCase())
  )
  const { theme } = useTheme()

  const areDefaultValuesChanged = getAreDefaultsChanged(networkFormValues, selectedNetwork)

  const handleSelectNetwork = (
    id: NetworkDescriptor['id'],
    rpcUrl: NetworkDescriptor['rpcUrl'],
    chainId: NetworkDescriptor['chainId']
  ) => {
    if (areDefaultValuesChanged) {
      // Temporary solution
      const isSure = window.confirm(
        t(
          'Are you sure you want to change the network without saving? This will discard all changes.'
        )
      )

      if (!isSure) return
    }
    setSelectedNetworkId(id)
    dispatch({
      type: 'SETTINGS_CONTROLLER_SET_NETWORK_TO_ADD_OR_UPDATE',
      params: {
        chainId,
        rpcUrl
      }
    })
  }

  return (
    <>
      <SettingsPageHeader title="Networks" />
      <View style={[flexbox.directionRow, flexbox.flex1]}>
        <View style={[{ flex: 1 }]}>
          <Search placeholder="Search for network" control={control} containerStyle={spacings.mb} />
          <ScrollableWrapper contentContainerStyle={{ flexGrow: 1 }}>
            {filteredNetworkBySearch.length > 0 ? (
              filteredNetworkBySearch.map((network) => (
                <Network
                  key={network.id}
                  network={network}
                  selectedNetworkId={selectedNetworkId}
                  handleSelectNetwork={handleSelectNetwork}
                />
              ))
            ) : (
              <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
                <Text weight="regular" fontSize={14} style={[text.center]}>
                  {t('No networks found.')}
                </Text>
                <Text weight="regular" fontSize={14} style={[text.center]}>
                  {t('Try searching for a different network.')}
                </Text>
              </View>
            )}
          </ScrollableWrapper>
          <View style={spacings.pt}>
            <Button
              type="secondary"
              text={t('Add custom network')}
              onPress={openBottomSheet as any}
              childrenPosition="left"
            >
              <AddIcon color={theme.primary} style={spacings.mrTy} />
            </Button>
          </View>
        </View>

        <View
          style={[
            { flex: 2 },
            maxWidthSize('xl') ? spacings.pl3Xl : spacings.plXl,
            maxWidthSize('xl') ? spacings.ml3Xl : spacings.mlXl,
            { borderLeftWidth: 1, borderColor: theme.secondaryBorder }
          ]}
        >
          <ScrollableWrapper contentContainerStyle={{ flexGrow: 1 }}>
            <View style={spacings.mbXl}>
              <NetworkDetails
                name={selectedNetwork?.name || '-'}
                iconUrl=""
                chainId={
                  selectedNetwork?.chainId ? Number(selectedNetwork.chainId).toString() : '-'
                }
                rpcUrl={selectedNetwork?.rpcUrl || '-'}
                nativeAssetSymbol={selectedNetwork?.nativeAssetSymbol || '-'}
                explorerUrl={selectedNetwork?.explorerUrl || '-'}
              />
            </View>
            {!!selectedNetwork && <NetworkAvailableFeatures features={features} />}
          </ScrollableWrapper>
        </View>
      </View>
      <BottomSheet
        id="add-new-network"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        style={{ maxWidth: tabLayoutWidths.sm }}
      >
        <NetworkForm />
      </BottomSheet>
    </>
  )
}

export default React.memo(NetworksSettingsScreen)
