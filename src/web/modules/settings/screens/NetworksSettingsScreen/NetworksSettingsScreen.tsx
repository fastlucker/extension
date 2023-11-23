import { JsonRpcProvider } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { NetworkPreference } from '@ambire-common/interfaces/settings'
import AddIcon from '@common/assets/svg/AddIcon'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import NetworkIcon from '@common/components/NetworkIcon'
import { NetworkIconNameType } from '@common/components/NetworkIcon/NetworkIcon'
import Search from '@common/components/Search'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import SettingsPage from '@web/modules/settings/components/SettingsPage'

const validateUrl = (value: string) => {
  if (!value) return 'URL cannot be empty'

  try {
    const url = new URL(value)

    return url.protocol === 'https:' ? undefined : 'URL must start with https://'
  } catch {
    return 'Invalid URL'
  }
}

const getInputFields = (selectedNetworkData?: NetworkDescriptor, rpcChainId?: bigint | null) => [
  {
    name: 'name',
    label: 'Network Name',
    editable: false,
    rules: {
      required: 'Field is required',
      minLength: 1
    }
  },
  {
    name: 'rpcUrl',
    label: 'RPC URL',
    editable: true,
    rules: {
      required: 'Field is required',
      validate: (value: string) => {
        if (!rpcChainId && value) return 'Invalid RPC URL'
        if (rpcChainId !== selectedNetworkData?.chainId)
          return `RPC chain id ${rpcChainId} does not match ${selectedNetworkData?.name} chain id ${selectedNetworkData?.chainId}`
        return undefined
      }
    }
  },
  {
    name: 'chainId',
    label: 'Chain ID',
    editable: false,
    rules: {
      required: 'Field is required'
    }
  },
  {
    name: 'nativeAssetSymbol',
    label: 'Currency Symbol',
    editable: false,
    rules: {
      required: 'Field is required'
    }
  },
  {
    name: 'explorerUrl',
    label: 'Block Explorer URL',
    editable: true,
    rules: {
      required: 'Field is required',
      validate: (value: string) => validateUrl(value)
    }
  }
]

const handleErrors = (error: any) => {
  if (typeof error === 'boolean') return error
  if (typeof error?.message === 'string') return error?.message
  if (!error) return false
}

const getAreDefaultsChanged = (values: any, selectedNetwork?: NetworkDescriptor) => {
  if (!selectedNetwork) {
    return false
  }

  return Object.keys(values).some((key) => {
    if (key === 'chainId') {
      return values[key] !== Number(selectedNetwork[key])
    }
    return key in selectedNetwork && values[key] !== selectedNetwork[key as keyof NetworkDescriptor]
  })
}

const NetworksSettingsScreen = () => {
  const { dispatch } = useBackgroundService()
  const { control, watch } = useForm({
    defaultValues: {
      search: ''
    }
  })
  const search = watch('search')
  const { networks } = useSettingsControllerState()
  const [selectedNetworkId, setSelectedNetworkId] = useState(networks[0].id)
  const [rpcChainId, setRpcChainId] = useState<bigint | null>(null)
  const selectedNetwork = networks.find((network) => network.id === selectedNetworkId)

  const {
    control: networkControl,
    watch: watchNetworkForm,
    formState: { errors: networkFormErrors, isValid: isNetworkFormValid },
    reset: resetNetworkForm
  } = useForm({
    mode: 'all',
    values: {
      name: selectedNetwork?.name || '',
      rpcUrl: selectedNetwork?.rpcUrl || '',
      chainId: Number(selectedNetwork?.chainId) || '',
      nativeAssetSymbol: selectedNetwork?.nativeAssetSymbol || '',
      explorerUrl: selectedNetwork?.explorerUrl || ''
    }
  })
  const filteredNetworkBySearch = networks.filter((network) =>
    network.name.toLowerCase().includes(search.toLowerCase())
  )
  const { theme } = useTheme()
  const networkFormValues = watchNetworkForm()

  const areDefaultValuesChanged = getAreDefaultsChanged(networkFormValues, selectedNetwork)

  const getRpcChainId = async (rpcUrl?: string) => {
    const rpc = new JsonRpcProvider(rpcUrl)

    try {
      const network = await rpc.getNetwork()
      setRpcChainId(network.chainId)
    } catch {
      setRpcChainId(null)
    }
  }

  useEffect(() => {
    getRpcChainId(networkFormValues.rpcUrl)
    const subscription = watchNetworkForm((value, { name }) => {
      if (name !== 'rpcUrl') return
      getRpcChainId(value.rpcUrl)
    })
    return () => {
      setRpcChainId(null)
      subscription.unsubscribe()
    }
  }, [])

  const inputFields = getInputFields(selectedNetwork, rpcChainId)

  const handleSave = () => {
    dispatch({
      type: 'MAIN_CONTROLLER_SETTINGS_UPDATE_NETWORK_PREFERENCES',
      params: {
        networkPreferences: {
          rpcUrl: networkFormValues.rpcUrl,
          explorerUrl: networkFormValues.explorerUrl
        },
        networkId: selectedNetworkId
      }
    })
  }

  const handleSelectNetwork = (id: string) => {
    if (areDefaultValuesChanged) {
      // Temporary solution
      const isSure = window.confirm('Are you sure you want to change the network without saving?')

      if (!isSure) return
    }
    setSelectedNetworkId(id)
  }

  const handleResetNetworkField = (preferenceKey: keyof NetworkPreference) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SETTINGS_RESET_NETWORK_PREFERENCE',
      params: {
        preferenceKey,
        networkId: selectedNetworkId
      }
    })
  }

  return (
    <SettingsPage currentPage="networks">
      <View
        style={[
          flexboxStyles.directionRow,
          flexboxStyles.justifySpaceBetween,
          flexboxStyles.alignCenter,
          spacings.mb2Xl
        ]}
      >
        <Text weight="medium" fontSize={20}>
          Networks
        </Text>
        <Search placeholder="Search for a previously added network" control={control} />
      </View>
      <View style={[flexboxStyles.directionRow]}>
        <View style={flexboxStyles.flex1}>
          <View style={spacings.mbXl}>
            {filteredNetworkBySearch.length > 0 ? (
              filteredNetworkBySearch.map((network) => (
                <Pressable
                  key={network.id}
                  onPress={() => handleSelectNetwork(network.id)}
                  style={({ hovered }: any) => [
                    flexboxStyles.directionRow,
                    flexboxStyles.alignCenter,
                    spacings.pvTy,
                    spacings.phTy,
                    common.borderRadiusPrimary,
                    spacings.mbMi,
                    network.id === selectedNetworkId || hovered
                      ? { backgroundColor: theme.secondaryBackground }
                      : {}
                  ]}
                >
                  <NetworkIcon name={network.id as NetworkIconNameType} />
                  <Text fontSize={16} weight="regular" style={spacings.mlMi}>
                    {network.name}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text weight="regular" style={spacings.mlSm}>
                No networks found. Try searching for a different network.
              </Text>
            )}
          </View>
          <Pressable
            disabled
            style={[
              flexboxStyles.directionRow,
              flexboxStyles.alignCenter,
              spacings.ml,
              { opacity: 0.6 }
            ]}
          >
            <AddIcon width={16} height={16} color={theme.primary} />
            <Text
              weight="regular"
              style={[spacings.mlSm, { textDecorationLine: 'underline' }]}
              appearance="primary"
              fontSize={16}
            >
              Add New Network
            </Text>
          </Pressable>
        </View>
        <View
          style={[
            flexboxStyles.flex1,
            spacings.pl3Xl,
            spacings.ml3Xl,
            { borderLeftWidth: 1, borderColor: theme.secondaryBorder }
          ]}
        >
          <View style={spacings.mb}>
            {inputFields.map((inputField) => (
              <Controller
                key={inputField.name}
                name={inputField.name as any}
                control={networkControl}
                rules={inputField?.rules}
                render={({ field }) => {
                  const correspondingConstantNetwork = constantNetworks.find(
                    (network) => network.id === selectedNetworkId
                  )
                  const correspondingNetwork = networks.find(
                    (network) => network.id === selectedNetworkId
                  )

                  const isChanged =
                    correspondingNetwork?.[inputField.name] !==
                    correspondingConstantNetwork?.[inputField.name]

                  return (
                    <Input
                      {...field}
                      disabled={!inputField.editable && selectedNetworkId !== 'custom'}
                      isValid={
                        !networkFormErrors[inputField.name as keyof typeof networkFormErrors] &&
                        inputField.editable
                      }
                      error={handleErrors(
                        networkFormErrors[inputField.name as keyof typeof networkFormErrors]
                      )}
                      containerStyle={spacings.mbLg}
                      label={inputField.label}
                      button={inputField.editable && isChanged ? 'Reset' : ''}
                      onButtonPress={() => handleResetNetworkField(inputField.name as any)}
                    />
                  )
                }}
              />
            ))}
          </View>
          <View style={[flexboxStyles.directionRow, { marginLeft: 'auto' }]}>
            <Button
              onPress={() => {
                resetNetworkForm()
              }}
              text="Cancel"
              type="secondary"
              disabled={!areDefaultValuesChanged}
              style={[spacings.mb0, { width: 120 }]}
            />
            <Button
              onPress={handleSave}
              text="Save"
              disabled={!areDefaultValuesChanged || !isNetworkFormValid}
              style={[spacings.mb0, spacings.mlSm, { width: 200 }]}
            />
          </View>
        </View>
      </View>
    </SettingsPage>
  )
}

export default NetworksSettingsScreen
