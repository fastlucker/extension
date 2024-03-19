import { JsonRpcProvider } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { NetworkPreference } from '@ambire-common/interfaces/settings'
import { getFeatures } from '@ambire-common/libs/settings/settings'
import { isValidURL } from '@ambire-common/services/validations'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import NetworkIcon from '@common/components/NetworkIcon'
import NumberInput from '@common/components/NumberInput'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import NetworkAvailableFeatures from '@web/components/NetworkAvailableFeatures'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import {
  getAreDefaultsChanged,
  handleErrors
} from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm/helpers'
import INPUT_FIELDS from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm/inputFields'

import getStyles from './styles'

const NetworkForm = ({
  selectedNetworkId = 'add-custom-network',
  onSaved
}: {
  selectedNetworkId?: NetworkDescriptor['id']
  onSaved: () => void
}) => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { networks } = useSettingsControllerState()
  const [isValidatingRPC, setValidatingRPC] = useState(false)
  const { theme, styles } = useTheme(getStyles)
  const { networkToAddOrUpdate } = useSettingsControllerState()

  const selectedNetwork = useMemo(
    () => networks.find((network) => network.id === selectedNetworkId),
    [networks, selectedNetworkId]
  )

  const isPredefinedNetwork = useMemo(
    () => selectedNetwork && predefinedNetworks.some((n) => n.id === selectedNetwork.id),
    [selectedNetwork]
  )

  const {
    watch,
    setError,
    clearErrors,
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onSubmit',
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

  const networkFormValues = watch()

  const areDefaultValuesChanged = getAreDefaultsChanged(networkFormValues, selectedNetwork)

  const features = useMemo(
    () =>
      networkToAddOrUpdate?.info
        ? getFeatures(networkToAddOrUpdate?.info)
        : errors.rpcUrl || errors.chainId
        ? getFeatures(undefined)
        : selectedNetwork?.features || getFeatures(undefined),
    [errors.chainId, errors.rpcUrl, networkToAddOrUpdate?.info, selectedNetwork?.features]
  )

  useEffect(() => {
    dispatch({
      type: 'SETTINGS_CONTROLLER_RESET_NETWORK_TO_ADD_OR_UPDATE'
    })
  }, [dispatch])

  const validateRpcUrlAndRecalculateFeaturesIfNeeded = useCallback(
    async (rpcUrl?: string, chainId?: string | number) => {
      setValidatingRPC(true)
      dispatch({ type: 'SETTINGS_CONTROLLER_RESET_NETWORK_TO_ADD_OR_UPDATE' })
      if (!rpcUrl) return

      if (!isValidURL(rpcUrl)) {
        setValidatingRPC(false)
        setError('rpcUrl', { type: 'custom-error', message: 'Invalid RPC URL' })
        return
      }

      if (!chainId) {
        setValidatingRPC(false)
        return
      }

      try {
        const rpc = new JsonRpcProvider(rpcUrl)
        const network = await rpc.getNetwork()
        rpc.destroy()

        if (Number(network.chainId) !== Number(chainId) && selectedNetwork && rpcUrl) {
          setValidatingRPC(false)
          setError('rpcUrl', {
            type: 'custom-error',
            message: `RPC chain id ${network.chainId} does not match ${selectedNetwork?.name} chain id ${chainId}`
          })
          return
        }

        if (
          rpcUrl !== selectedNetwork?.rpcUrl ||
          Number(chainId) !== Number(selectedNetwork?.chainId)
        ) {
          dispatch({
            type: 'SETTINGS_CONTROLLER_SET_NETWORK_TO_ADD_OR_UPDATE',
            params: { rpcUrl, chainId: BigInt(chainId) }
          })
        }
        setValidatingRPC(false)
        clearErrors('rpcUrl')
      } catch (error) {
        setValidatingRPC(false)
        setError('rpcUrl', { type: 'custom-error', message: 'Invalid RPC URL' })
      }
    },
    [selectedNetwork, clearErrors, setError, dispatch]
  )

  useEffect(() => {
    // We can't just validate using a custom validate rule, because getNetwork is async
    // and resetting the form doesn't wait for the validation to finish so we get an error
    // when resetting the form.
    const subscription = watch(async (value, { name }) => {
      if (name && !value[name]) {
        setError(name, {
          type: 'custom-error',
          message: 'Field is required'
        })
        return
      }

      if (name === 'name') {
        if (
          selectedNetworkId === 'add-custom-network' &&
          networks.some((n) => n.name.toLowerCase() === value.name?.toLowerCase())
        ) {
          setError('name', {
            type: 'custom-error',
            message: `Network with name: ${value.name} already added`
          })
          return
        }
        clearErrors('name')
      }

      if (name === 'chainId') {
        if (
          selectedNetworkId === 'add-custom-network' &&
          networks.some((n) => Number(n.chainId) === Number(value.chainId))
        ) {
          setError('chainId', {
            type: 'custom-error',
            message: `Network with chainID: ${value.chainId} already added`
          })
          return
        }
        clearErrors('chainId')
      }

      if (name === 'rpcUrl' || name === 'chainId') {
        await validateRpcUrlAndRecalculateFeaturesIfNeeded(value.rpcUrl, value.chainId)
      }

      if (name === 'explorerUrl') {
        if (!value.explorerUrl) {
          setError('explorerUrl', {
            type: 'custom-error',
            message: 'URL cannot be empty'
          })
          return
        }

        try {
          const url = new URL(value.explorerUrl)
          if (url.protocol !== 'https:') {
            setError('explorerUrl', {
              type: 'custom-error',
              message: 'URL must start with https://'
            })
            return
          }
        } catch {
          setError('explorerUrl', {
            type: 'custom-error',
            message: 'Invalid URL'
          })
          return
        }
        clearErrors('explorerUrl')
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [
    selectedNetworkId,
    networks,
    validateRpcUrlAndRecalculateFeaturesIfNeeded,
    clearErrors,
    setError,
    watch
  ])

  const handleSubmitButtonPress = () => {
    // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-floating-promises
    handleSubmit(async (fields: any) => {
      if (selectedNetworkId === 'add-custom-network') {
        const emptyFields = Object.keys(fields).filter((key) => !fields[key].length)
        emptyFields.forEach((k) => {
          setError(k as any, {
            type: 'custom-error',
            message: 'Field is required'
          })
        })
        if (emptyFields.length) return

        dispatch({
          type: 'SETTINGS_CONTROLLER_ADD_CUSTOM_NETWORK',
          params: { ...networkFormValues, chainId: BigInt(networkFormValues.chainId) }
        })
      } else {
        const emptyFields = Object.keys(fields)
          .filter((key) => !fields[key].length)
          .filter((k) => INPUT_FIELDS.find((f) => f.name === k)!.editable)

        emptyFields.forEach((k) => {
          setError(k as any, {
            type: 'custom-error',
            message: 'Field is required'
          })
        })

        if (emptyFields.length) return
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
      !!onSaved && onSaved()
    })()
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
      <View style={styles.modalHeader}>
        {selectedNetworkId === 'add-custom-network' && (
          <Text fontSize={20} weight="medium">
            {t('Add custom network')}
          </Text>
        )}
        {selectedNetworkId !== 'add-custom-network' && !!selectedNetwork && (
          <>
            <NetworkIcon name={selectedNetwork.id as any} style={styles.networkIcon} size={40} />
            <Text appearance="secondaryText" weight="regular" style={spacings.mrMi} fontSize={16}>
              {selectedNetwork.name || t('Unknown network')}
            </Text>
          </>
        )}
      </View>
      <View style={[spacings.phXl, spacings.pvXl, flexbox.directionRow, flexbox.flex1]}>
        <View style={flexbox.flex1}>
          <Text fontSize={18} weight="medium" style={spacings.mbMd}>
            {t('Network details')}
          </Text>
          <ScrollableWrapper contentContainerStyle={{ flexGrow: 1 }}>
            {INPUT_FIELDS.map((inputField, index) => (
              <Controller
                key={inputField.name}
                name={inputField.name as any}
                control={control}
                render={({ field: { onBlur, onChange, value } }) => {
                  const correspondingConstantNetwork = predefinedNetworks.find(
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
                      disabled={!inputField.editable && selectedNetworkId !== 'add-custom-network'}
                      allowHex
                      tooltip={
                        inputField.name === 'chainId'
                          ? {
                              id: inputField.name,
                              content: t(
                                "The chain ID is a unique network identifier used to validate the provided RPC URL. You can input a decimal or '0x'-prefixed hexadecimal number."
                              )
                            }
                          : undefined
                      }
                      isValid={
                        !errors[inputField.name as keyof typeof errors] &&
                        inputField.editable &&
                        selectedNetworkId !== 'add-custom-network'
                      }
                      error={(() => {
                        if (inputField.name === 'rpcUrl' && isValidatingRPC) return false
                        return handleErrors(errors[inputField.name as keyof typeof errors])
                      })()}
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 40 }}
                      containerStyle={index + 1 !== INPUT_FIELDS.length ? spacings.mb : {}}
                      label={inputField.label}
                      button={
                        inputField.editable && isChanged && isPredefinedNetwork ? 'Reset' : ''
                      }
                      onButtonPress={() =>
                        handleResetNetworkField(inputField.name as keyof NetworkPreference)
                      }
                    />
                  )
                }}
              />
            ))}
          </ScrollableWrapper>
        </View>
        <View
          style={[
            { flex: 1.5 },
            spacings.plXl,
            spacings.mlXl,
            { borderLeftWidth: 1, borderColor: theme.secondaryBorder }
          ]}
        >
          <ScrollableWrapper contentContainerStyle={{ flexGrow: 1 }}>
            <View style={flexbox.flex1}>
              <NetworkAvailableFeatures networkId={selectedNetwork?.id} features={features} />
            </View>
            <View style={flexbox.alignEnd}>
              {selectedNetworkId === 'add-custom-network' ? (
                <Button
                  onPress={handleSubmitButtonPress}
                  text={t('Add network')}
                  disabled={
                    !!Object.keys(errors).length ||
                    isValidatingRPC ||
                    features.some((f) => f.level === 'loading') ||
                    !!features.filter((f) => f.id === 'flagged')[0]
                  }
                  hasBottomSpacing={false}
                  size="large"
                />
              ) : (
                <View style={[flexbox.directionRow]}>
                  <Button
                    onPress={reset as any}
                    text={t('Cancel')}
                    type="secondary"
                    disabled={!areDefaultValuesChanged}
                    hasBottomSpacing={false}
                    style={[flexbox.flex1, spacings.mr, { width: 160 }]}
                    size="large"
                  />

                  <Button
                    onPress={handleSubmitButtonPress}
                    text={t('Save')}
                    disabled={
                      !areDefaultValuesChanged || !!Object.keys(errors).length || isValidatingRPC
                    }
                    style={[spacings.mlMi, flexbox.flex1, { width: 160 }]}
                    hasBottomSpacing={false}
                    size="large"
                  />
                </View>
              )}
            </View>
          </ScrollableWrapper>
        </View>
      </View>
      <Tooltip id="chainId" />
    </>
  )
}

export default React.memo(NetworkForm)
