import { JsonRpcProvider } from 'ethers'
import React, { useEffect } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { View } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { NetworkPreference } from '@ambire-common/interfaces/settings'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import { getAreDefaultsChanged, handleErrors } from './helpers'
import INPUT_FIELDS from './inputFields'

const NetworkForm = ({
  networkForm,
  selectedNetwork,
  selectedNetworkId
}: {
  networkForm: UseFormReturn<
    {
      name: string
      rpcUrl: string
      chainId: string | number
      nativeAssetSymbol: string
      explorerUrl: string
    },
    any
  >
  selectedNetwork?: NetworkDescriptor
  selectedNetworkId: NetworkDescriptor['id']
}) => {
  const {
    watch,
    setError,
    clearErrors,
    control,
    reset,
    formState: { isValid, errors }
  } = networkForm
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { networks } = useSettingsControllerState()
  const { theme } = useTheme()
  const networkFormValues = watch()

  const areDefaultValuesChanged = getAreDefaultsChanged(networkFormValues, selectedNetwork)

  useEffect(() => {
    // We can't just validate using a custom validate rule, because getNetwork is async
    // and resetting the form doesn't wait for the validation to finish so we get an error
    // when resetting the form.
    const subscription = watch(async (value, { name }) => {
      if (name !== 'rpcUrl') return
      try {
        const rpc = new JsonRpcProvider(value.rpcUrl)
        const network = await rpc.getNetwork()

        if (network.chainId !== selectedNetwork?.chainId) {
          setError('rpcUrl', {
            type: 'custom',
            message: `RPC chain id ${network.chainId} does not match ${selectedNetwork?.name} chain id ${selectedNetwork?.chainId}`
          })
          return
        }
        clearErrors('rpcUrl')
      } catch {
        setError('rpcUrl', { type: 'custom', message: 'Invalid RPC URL' })
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [selectedNetwork?.chainId, selectedNetwork?.name, setError, watch, clearErrors])

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
    addToast(`${selectedNetwork?.name} settings saved!`)
  }

  const handleResetNetworkField = (preferenceKey: keyof NetworkPreference) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SETTINGS_RESET_NETWORK_PREFERENCE',
      params: {
        preferenceKey,
        networkId: selectedNetworkId
      }
    })
    addToast(
      `Reset "${INPUT_FIELDS.find((field) => field.name === preferenceKey)?.label || ''}" for ${
        selectedNetwork?.name
      }.`
    )
  }

  return (
    <View
      style={[
        flexboxStyles.flex1,
        IS_SCREEN_SIZE_DESKTOP_LARGE ? spacings.pl3Xl : spacings.plXl,
        IS_SCREEN_SIZE_DESKTOP_LARGE ? spacings.ml3Xl : spacings.mlXl,
        { borderLeftWidth: 1, borderColor: theme.secondaryBorder }
      ]}
    >
      <View style={spacings.mb}>
        {INPUT_FIELDS.map((inputField) => (
          <Controller
            key={inputField.name}
            name={inputField.name as any}
            control={control}
            rules={inputField?.rules}
            render={({ field: { onBlur, onChange, value } }) => {
              const correspondingConstantNetwork = constantNetworks.find(
                (network) => network.id === selectedNetworkId
              )
              const correspondingNetwork = networks.find(
                (network) => network.id === selectedNetworkId
              )

              const isChanged =
                correspondingNetwork?.[inputField.name as keyof typeof correspondingNetwork] !==
                correspondingConstantNetwork?.[
                  inputField.name as keyof typeof correspondingConstantNetwork
                ]

              return (
                <Input
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  disabled={!inputField.editable && selectedNetworkId !== 'custom'}
                  isValid={!errors[inputField.name as keyof typeof errors] && inputField.editable}
                  error={handleErrors(errors[inputField.name as keyof typeof errors])}
                  containerStyle={spacings.mbLg}
                  label={inputField.label}
                  button={inputField.editable && isChanged ? 'Reset' : ''}
                  onButtonPress={() =>
                    handleResetNetworkField(inputField.name as keyof NetworkPreference)
                  }
                />
              )
            }}
          />
        ))}
      </View>
      <View style={[flexboxStyles.directionRow, { marginLeft: 'auto' }]}>
        <Button
          onPress={() => {
            reset({
              name: selectedNetwork?.name || '',
              rpcUrl: selectedNetwork?.rpcUrl || '',
              chainId: Number(selectedNetwork?.chainId) || '',
              nativeAssetSymbol: selectedNetwork?.nativeAssetSymbol || '',
              explorerUrl: selectedNetwork?.explorerUrl || ''
            })
          }}
          text="Cancel"
          type="secondary"
          disabled={!areDefaultValuesChanged}
          style={[spacings.mb0, { width: 120 }]}
        />
        <Button
          onPress={handleSave}
          text="Save"
          disabled={!areDefaultValuesChanged || !isValid || !!errors?.rpcUrl}
          style={[spacings.mb0, spacings.mlSm, { width: 200 }]}
        />
      </View>
    </View>
  )
}

export default NetworkForm
