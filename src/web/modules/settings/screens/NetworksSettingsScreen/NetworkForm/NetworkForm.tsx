import { JsonRpcProvider } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { NetworkPreference } from '@ambire-common/interfaces/settings'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import NumberInput from '@common/components/NumberInput'
import Text from '@common/components/Text'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import {
  getAreDefaultsChanged,
  handleErrors
} from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm/helpers'
import INPUT_FIELDS from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm/inputFields'

type NetworkFormType = UseFormReturn<
  {
    name: string
    rpcUrl: string
    chainId: string | number
    nativeAssetSymbol: string
    explorerUrl: string
  },
  any
>

const NetworkForm = ({
  networkForm,
  selectedNetworkId = 'custom'
}: {
  networkForm?: NetworkFormType
  selectedNetworkId?: NetworkDescriptor['id']
}) => {
  const { t } = useTranslation()
  const {
    watch,
    setError,
    clearErrors,
    control,
    reset,
    formState: { isValid, errors }
  } = (networkForm as NetworkFormType) ||
  useForm({
    // Mode onChange is required to validate the rpcUrl field, because custom errors are overwritten by errors from the rules.
    mode: 'onChange',
    defaultValues: {
      name: '',
      rpcUrl: '',
      chainId: '',
      nativeAssetSymbol: '',
      explorerUrl: ''
    },
    values: {
      name: '',
      rpcUrl: '',
      chainId: '',
      nativeAssetSymbol: '',
      explorerUrl: ''
    }
  })
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { networks } = useSettingsControllerState()

  const [isLoadingRPC, setIsLoadingRPC] = useState(false)

  const networkFormValues = watch()

  const selectedNetwork = useMemo(
    () => networks.find((network) => network.id === selectedNetworkId),
    [networks, selectedNetworkId]
  )

  const areDefaultValuesChanged = getAreDefaultsChanged(networkFormValues, selectedNetwork)

  useEffect(() => {
    // We can't just validate using a custom validate rule, because getNetwork is async
    // and resetting the form doesn't wait for the validation to finish so we get an error
    // when resetting the form.
    const subscription = watch(async (value, { name }) => {
      if (
        name === 'name' &&
        selectedNetworkId === 'custom' &&
        networks.some((n) => n.name.toLowerCase() === value.name?.toLowerCase())
      ) {
        setError('name', {
          message: `Network with name: ${value.name} already added`
        })
      }

      if (
        name === 'chainId' &&
        selectedNetworkId === 'custom' &&
        networks.some((n) => Number(n.chainId) === Number(value.chainId))
      ) {
        setError('chainId', {
          message: `Network with chainID: ${value.chainId} already added`
        })
      }
      if (name === 'rpcUrl' || name === 'chainId') {
        try {
          setIsLoadingRPC(true)
          const rpc = new JsonRpcProvider(value.rpcUrl)
          const network = await rpc.getNetwork()
          if (value.chainId && Number(network.chainId) !== Number(value.chainId)) {
            setIsLoadingRPC(false)
            return setError('rpcUrl', {
              type: 'custom',
              message: `RPC chain id ${network.chainId} does not match ${selectedNetwork?.name} chain id ${value.chainId}`
            })
          }
          setIsLoadingRPC(false)
          clearErrors('rpcUrl')
        } catch (error) {
          setIsLoadingRPC(false)
          setError('rpcUrl', { type: 'custom', message: 'Invalid RPC URL' })
        }
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [selectedNetworkId, networks, selectedNetwork?.name, setError, watch, clearErrors])

  const handleSubmitButtonPress = () => {
    if (selectedNetworkId === 'custom') {
      dispatch({
        type: 'SETTINGS_CONTROLLER_ADD_CUSTOM_NETWORK',
        params: { ...networkFormValues, chainId: BigInt(networkFormValues.chainId) }
      })
    } else {
      dispatch({
        type: 'MAIN_CONTROLLER_UPDATE_NETWORK_PREFERENCES',
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
  }

  const handleResetNetworkField = (preferenceKey: keyof NetworkPreference) => {
    dispatch({
      type: 'MAIN_CONTROLLER_RESET_NETWORK_PREFERENCE',
      params: { preferenceKey, networkId: selectedNetworkId }
    })
    addToast(
      `Reset "${INPUT_FIELDS.find((field) => field.name === preferenceKey)?.label || ''}" for ${
        selectedNetwork?.name
      }.`
    )
  }

  return (
    <>
      {selectedNetworkId === 'custom' && (
        <Text fontSize={20} weight="medium" style={spacings.mbLg}>
          {t('Add custom network')}
        </Text>
      )}
      <View style={selectedNetworkId !== 'custom' && spacings.mb}>
        {INPUT_FIELDS.map((inputField, index) => (
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

              const InputComponent = inputField.name === 'chainId' ? NumberInput : Input

              return (
                <InputComponent
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  disabled={!inputField.editable && selectedNetworkId !== 'custom'}
                  isValid={
                    !errors[inputField.name as keyof typeof errors] &&
                    inputField.editable &&
                    selectedNetworkId !== 'custom'
                  }
                  error={(() => {
                    if (inputField.name === 'rpcUrl' && isLoadingRPC) return false
                    return handleErrors(errors[inputField.name as keyof typeof errors])
                  })()}
                  inputWrapperStyle={{ height: 40 }}
                  inputStyle={{ height: 40 }}
                  containerStyle={index + 1 !== INPUT_FIELDS.length ? spacings.mb : {}}
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
      {selectedNetworkId === 'custom' ? (
        <Button
          onPress={handleSubmitButtonPress}
          text={t('Add network')}
          style={{ alignSelf: 'flex-start' }}
          disabled={!isValid || !!errors?.rpcUrl || isLoadingRPC}
          hasBottomSpacing={false}
          size="large"
        />
      ) : (
        <View style={[flexbox.directionRow, flexbox.flex1]}>
          <Button
            onPress={reset as any}
            text={t('Cancel')}
            type="secondary"
            disabled={!areDefaultValuesChanged}
            hasBottomSpacing={false}
            style={[flexbox.flex1, spacings.mrMi]}
            size="large"
          />

          <Button
            onPress={handleSubmitButtonPress}
            text={t('Save')}
            disabled={!areDefaultValuesChanged || !isValid || !!errors?.rpcUrl || isLoadingRPC}
            style={[spacings.mlMi, flexbox.flex1]}
            hasBottomSpacing={false}
            size="large"
          />
        </View>
      )}
    </>
  )
}

export default NetworkForm
