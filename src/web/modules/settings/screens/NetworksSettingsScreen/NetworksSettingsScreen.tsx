import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

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
import { tabLayoutWidths } from '@web/components/TabLayoutWrapper'
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
  const { maxWidthSize } = useWindowSize()

  const search = watch('search')
  const { networks } = useSettingsControllerState()
  const [selectedNetworkId, setSelectedNetworkId] = useState(() => {
    const parsedSearchParams = new URLSearchParams(searchParams)

    if (parsedSearchParams.has('networkId')) {
      return parsedSearchParams.get('networkId') as string
    }

    return networks[0].id
  })

  const selectedNetwork = useMemo(
    () => networks.find((network) => network.id === selectedNetworkId),
    [networks, selectedNetworkId]
  )

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

  const handleSelectNetwork = (id: string) => {
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
  }

  return (
    <>
      <SettingsPageHeader title="Networks" />
      <View style={[flexbox.directionRow, flexbox.flex1]}>
        <View style={[flexbox.flex1]}>
          <Search placeholder="Search for network" control={control} />
          <ScrollableWrapper style={spacings.mbLg}>
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
              <Text weight="regular" style={spacings.mlSm}>
                {t('No networks found. Try searching for a different network.')}
              </Text>
            )}
          </ScrollableWrapper>
          <Button
            type="secondary"
            text={t('Add custom network')}
            onPress={openBottomSheet as any}
            childrenPosition="left"
          >
            <AddIcon color={theme.primary} style={spacings.mrTy} />
          </Button>
        </View>

        <View
          style={[
            flexbox.flex1,
            maxWidthSize('xl') ? spacings.plXl : spacings.plLg,
            maxWidthSize('xl') ? spacings.mlXl : spacings.mlLg,
            { borderLeftWidth: 1, borderColor: theme.secondaryBorder }
          ]}
        >
          <NetworkForm networkForm={networkForm} selectedNetworkId={selectedNetworkId} />
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
