/* eslint-disable no-param-reassign */
import { JsonRpcProvider } from 'ethers'
import { setStringAsync } from 'expo-clipboard'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View, ViewStyle } from 'react-native'

import { networks as predefinedNetworks } from '@ambire-common/consts/networks'
import { NetworkId } from '@ambire-common/interfaces/network'
import { canForce4337, getFeatures } from '@ambire-common/libs/networks/networks'
import { isValidURL } from '@ambire-common/services/validations'
import CopyIcon from '@common/assets/svg/CopyIcon'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
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
import text from '@common/styles/utils/text'
import NetworkAvailableFeatures from '@web/components/NetworkAvailableFeatures'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import {
  getAreDefaultsChanged,
  handleErrors
} from '@web/modules/settings/screens/NetworksSettingsScreen/NetworkForm/helpers'

import getStyles from './styles'

type RpcSelectorItemType = {
  index: number
  url: string
  rpcUrlsLength: number
  forceLargeItems?: boolean
  selectedRpcUrl?: string
  shouldShowRemove: boolean
  style?: ViewStyle
  onPress: (url: string) => void
  onRemove?: (url: string) => void
}

export const RpcSelectorItem = React.memo(
  ({
    index,
    url,
    rpcUrlsLength,
    forceLargeItems,
    selectedRpcUrl,
    shouldShowRemove,
    style,
    onPress,
    onRemove
  }: RpcSelectorItemType) => {
    const { t } = useTranslation()
    const { addToast } = useToast()
    const { styles, theme } = useTheme(getStyles)
    const [hovered, setHovered] = useState(false)
    const [bindCopyIconAnim, copyIconAnimStyle] = useHover({
      preset: 'opacity'
    })

    const handleCopy = useCallback(async () => {
      try {
        await setStringAsync(url)
        addToast(t('Copied to clipboard!'), { timeout: 2500 })
      } catch (error) {
        addToast(t('Failed to copy to clipboard'), { type: 'error' })
      }
    }, [addToast, t, url])

    return (
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Pressable
          style={[
            styles.selectRpcItem,
            index !== rpcUrlsLength - 1 && styles.selectRpcItemBorder,
            (rpcUrlsLength <= 2 || forceLargeItems) && { height: 40 },
            style,
            hovered && { backgroundColor: theme.tertiaryBackground }
          ]}
          onPress={() => {
            if (url !== selectedRpcUrl) onPress(url)
          }}
        >
          <View
            style={[
              styles.radio,
              selectedRpcUrl === url && styles.radioSelected,
              hovered && styles.radioHovered
            ]}
          >
            {selectedRpcUrl === url && <View style={styles.radioSelectedInner} />}
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
            <Text
              fontSize={14}
              appearance={selectedRpcUrl === url ? 'primaryText' : 'secondaryText'}
              numberOfLines={1}
            >
              {url}
            </Text>
            <AnimatedPressable
              onPress={handleCopy}
              style={[spacings.mlMi, copyIconAnimStyle]}
              {...bindCopyIconAnim}
            >
              <CopyIcon width={16} height={16} />
            </AnimatedPressable>
          </View>
          {!!shouldShowRemove && !!hovered && (
            <View style={spacings.plLg}>
              <Pressable onPress={() => !!onRemove && onRemove(url)}>
                {({ hovered: removeButtonHovered }: any) => (
                  <Text
                    fontSize={12}
                    underline
                    color={removeButtonHovered ? theme.errorText : theme.errorDecorative}
                  >
                    {t('Remove')}
                  </Text>
                )}
              </Pressable>
            </View>
          )}
        </Pressable>
      </div>
    )
  }
)

const NetworkForm = ({
  selectedNetworkId = 'add-custom-network',
  onCancel,
  onSaved
}: {
  selectedNetworkId?: NetworkId
  onCancel: () => void
  onSaved: () => void
}) => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { networks, networkToAddOrUpdate, statuses } = useNetworksControllerState()
  const [isValidatingRPC, setValidatingRPC] = useState<boolean>(false)
  const { styles, theme } = useTheme(getStyles)

  const selectedNetwork = useMemo(
    () => networks.find((network) => network.id === selectedNetworkId),
    [networks, selectedNetworkId]
  )

  const isPredefinedNetwork = useMemo(
    () => selectedNetwork && selectedNetwork.predefined,
    [selectedNetwork]
  )

  const allowedToForce4337 = canForce4337(selectedNetwork)

  const {
    watch,
    setError,
    clearErrors,
    control,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields }
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      rpcUrl: '',
      chainId: '',
      nativeAssetSymbol: '',
      explorerUrl: '',
      coingeckoPlatformId: '',
      coingeckoNativeAssetId: '',
      ...(allowedToForce4337 ? { force4337: false } : {})
    },
    values: {
      name: selectedNetwork?.name || '',
      rpcUrl: '',
      chainId: Number(selectedNetwork?.chainId) || '',
      nativeAssetSymbol: selectedNetwork?.nativeAssetSymbol || '',
      explorerUrl: selectedNetwork?.explorerUrl || '',
      coingeckoPlatformId: (selectedNetwork?.platformId as string) || '',
      coingeckoNativeAssetId: (selectedNetwork?.nativeAssetId as string) || '',
      ...(allowedToForce4337 ? { force4337: selectedNetwork?.force4337 ?? false } : {})
    }
  })
  const [rpcUrls, setRpcUrls] = useState(selectedNetwork?.rpcUrls || [])
  const [selectedRpcUrl, setSelectedRpcUrl] = useState(selectedNetwork?.selectedRpcUrl)
  const networkFormValues = watch()

  const isSomethingUpdated = useMemo(() => {
    if (selectedRpcUrl !== selectedNetwork?.selectedRpcUrl) return true
    return getAreDefaultsChanged({ ...networkFormValues, rpcUrls }, selectedNetwork)
  }, [networkFormValues, rpcUrls, selectedNetwork, selectedRpcUrl])

  const features = useMemo(
    () =>
      networkToAddOrUpdate?.info
        ? getFeatures(networkToAddOrUpdate?.info)
        : errors.chainId
        ? getFeatures(undefined)
        : selectedNetwork?.features || getFeatures(undefined),
    [errors.chainId, networkToAddOrUpdate?.info, selectedNetwork?.features]
  )

  useEffect(() => {
    dispatch({
      type: 'SETTINGS_CONTROLLER_RESET_NETWORK_TO_ADD_OR_UPDATE'
    })
  }, [dispatch])

  const validateRpcUrlAndRecalculateFeatures = useCallback(
    async (rpcUrl?: string, chainId?: string | number, type: 'add' | 'change' = 'change') => {
      setValidatingRPC(true)
      if (type === 'change') {
        dispatch({ type: 'SETTINGS_CONTROLLER_RESET_NETWORK_TO_ADD_OR_UPDATE' })
      }
      if (!rpcUrl && !selectedRpcUrl) {
        setValidatingRPC(false)
        return
      }
      if (!rpcUrl && !chainId) {
        setValidatingRPC(false)
        return
      }

      if (rpcUrl && !rpcUrl.startsWith('http')) {
        setValidatingRPC(false)
        setError('rpcUrl', {
          type: 'custom-error',
          message: 'RPC URLs must include the correct HTTP/HTTPS prefix'
        })
        return
      }

      if (rpcUrl && !isValidURL(rpcUrl)) {
        setValidatingRPC(false)
        setError('rpcUrl', { type: 'custom-error', message: 'Invalid RPC URL' })
        return
      }

      if (rpcUrl && rpcUrls.includes(rpcUrl)) {
        setValidatingRPC(false)
        setError('rpcUrl', { type: 'custom-error', message: 'RPC URL already added' })
        return
      }

      try {
        const rpc = new JsonRpcProvider(rpcUrl)
        const network = await rpc.getNetwork()
        rpc.destroy()

        if (!chainId) {
          chainId = Number(network.chainId).toString()
          setValue('chainId', chainId)
        }

        if (Number(network.chainId) !== Number(chainId) && rpcUrl) {
          setValidatingRPC(false)
          setError('rpcUrl', {
            type: 'custom-error',
            message: `RPC chain id ${network.chainId} does not match ${selectedNetwork?.name} chain id ${chainId}`
          })
          return
        }

        if (
          networks.find((n) => n.chainId === network.chainId) &&
          selectedNetworkId === 'add-custom-network'
        ) {
          setValidatingRPC(false)
          setError('rpcUrl', {
            type: 'custom-error',
            message: `You already have a network with RPC chain id ${network.chainId}`
          })
          return
        }

        if (
          type === 'change' &&
          (rpcUrl !== selectedNetwork?.selectedRpcUrl ||
            Number(chainId) !== Number(selectedNetwork?.chainId))
        ) {
          if (!rpcUrl) {
            addToast('Invalid RPC url', { type: 'error' })
            return
          }
          dispatch({
            type: 'SETTINGS_CONTROLLER_SET_NETWORK_TO_ADD_OR_UPDATE',
            params: { rpcUrl: rpcUrl as string, chainId: BigInt(chainId) }
          })
        }
        setValidatingRPC(false)
        clearErrors('rpcUrl')
      } catch (error) {
        setValidatingRPC(false)
        setError('rpcUrl', { type: 'custom-error', message: 'Invalid RPC URL' })
      }
    },
    [
      selectedRpcUrl,
      rpcUrls,
      dispatch,
      setError,
      networks,
      selectedNetworkId,
      selectedNetwork?.selectedRpcUrl,
      selectedNetwork?.chainId,
      selectedNetwork?.name,
      clearErrors,
      setValue,
      addToast
    ]
  )

  useEffect(() => {
    // We can't just validate using a custom validate rule, because getNetwork is async
    // and resetting the form doesn't wait for the validation to finish so we get an error
    // when resetting the form.
    const subscription = watch(async (value, { name }) => {
      if (name && !value[name]) {
        if (name !== 'rpcUrl' && (!allowedToForce4337 || name !== 'force4337')) {
          setError(name, { type: 'custom-error', message: 'Field is required' })
          return
        }
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

      if (name === 'nativeAssetSymbol') {
        clearErrors('nativeAssetSymbol')
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

      if (name === 'chainId') {
        await validateRpcUrlAndRecalculateFeatures(undefined, value.chainId)
      }

      if (name === 'explorerUrl') {
        if (!value.explorerUrl) {
          setError('explorerUrl', { type: 'custom-error', message: 'URL cannot be empty' })
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
          setError('explorerUrl', { type: 'custom-error', message: 'Invalid URL' })
          return
        }
        clearErrors('explorerUrl')
      }

      if (name === 'rpcUrl') {
        clearErrors('rpcUrl')
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [
    selectedNetworkId,
    networks,
    touchedFields,
    allowedToForce4337,
    validateRpcUrlAndRecalculateFeatures,
    clearErrors,
    setError,
    watch
  ])

  useEffect(() => {
    if (statuses.addNetwork === 'SUCCESS') {
      addToast('Network successfully added!')
      !!onSaved && onSaved()
    }
  }, [addToast, onSaved, statuses.addNetwork])

  useEffect(() => {
    if (statuses.updateNetwork === 'SUCCESS') {
      addToast(`${selectedNetwork?.name} settings saved!`)
      !!onSaved && onSaved()
    }
  }, [addToast, onSaved, selectedNetwork?.name, statuses.updateNetwork])

  const handleSubmitButtonPress = () => {
    // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-floating-promises
    handleSubmit(async (formFields: any) => {
      let emptyFields: string[] = []

      if (selectedNetworkId === 'add-custom-network') {
        emptyFields = Object.keys(formFields).filter(
          (key) =>
            !['rpcUrl', 'rpcUrls', 'coingeckoPlatformId', 'coingeckoNativeAssetId'].includes(key) &&
            !formFields[key].length
        )
      } else {
        emptyFields = Object.keys(formFields).filter(
          (key) => ['explorerUrl'].includes(key) && !formFields[key].length
        )
      }

      if (!rpcUrls.length)
        setError('rpcUrl', {
          type: 'custom-error',
          message: 'At least one RPC URL should be added'
        })

      emptyFields.forEach((k) => {
        setError(k as any, { type: 'custom-error', message: 'Field is required' })
      })

      if (emptyFields.length || !rpcUrls.length || !selectedRpcUrl) return

      if (selectedNetworkId === 'add-custom-network') {
        dispatch({
          type: 'MAIN_CONTROLLER_ADD_NETWORK',
          params: {
            ...networkFormValues,
            name: networkFormValues.name,
            nativeAssetSymbol: networkFormValues.nativeAssetSymbol,
            explorerUrl: networkFormValues.explorerUrl,
            rpcUrls,
            selectedRpcUrl,
            chainId: BigInt(networkFormValues.chainId),
            iconUrls: []
          }
        })
      } else {
        dispatch({
          type: 'MAIN_CONTROLLER_UPDATE_NETWORK',
          params: {
            network: {
              rpcUrls,
              selectedRpcUrl,
              explorerUrl: networkFormValues.explorerUrl,
              ...(allowedToForce4337 ? { force4337: networkFormValues.force4337 } : {})
            },
            networkId: selectedNetworkId
          }
        })
      }
    })()
  }

  const handleSelectRpcUrl = useCallback(
    (url: string) => {
      if (selectedRpcUrl !== url) {
        setSelectedRpcUrl(url)
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        const chainId = watch('chainId')
        if (chainId) {
          dispatch({
            type: 'SETTINGS_CONTROLLER_SET_NETWORK_TO_ADD_OR_UPDATE',
            params: { rpcUrl: url, chainId: BigInt(chainId) }
          })
        }
      }
    },
    [selectedRpcUrl, dispatch, watch]
  )

  const handleRemoveRpcUrl = useCallback(
    (url: string) => {
      if (isPredefinedNetwork && predefinedNetworks.find((n) => n.rpcUrls.includes(url))) return

      const filteredRpcUrls = rpcUrls.filter((u) => u !== url)
      if (url === selectedRpcUrl) {
        if (filteredRpcUrls.length) {
          handleSelectRpcUrl(filteredRpcUrls[0])
        }
      }
      setRpcUrls(filteredRpcUrls)
    },
    [isPredefinedNetwork, rpcUrls, selectedRpcUrl, handleSelectRpcUrl]
  )

  const handleAddRpcUrl = useCallback(
    async (value: string) => {
      const trimmedVal = value.trim()
      await validateRpcUrlAndRecalculateFeatures(trimmedVal, watch('chainId'), 'add')
      if (!errors.rpcUrl) {
        setRpcUrls((p) => [trimmedVal, ...p])
        if (!rpcUrls.length) {
          handleSelectRpcUrl(trimmedVal)
        }
      }
    },
    [rpcUrls.length, watch, errors, handleSelectRpcUrl, validateRpcUrlAndRecalculateFeatures]
  )

  const isSaveOrAddButtonDisabled = useMemo(
    () =>
      !!Object.keys(errors).length ||
      isValidatingRPC ||
      features.some((f) => f.level === 'loading') ||
      !!features.filter((f) => f.id === 'flagged')[0],
    [errors, features, isValidatingRPC]
  )

  return (
    <>
      <View style={styles.modalHeader}>
        {selectedNetworkId === 'add-custom-network' && (
          <Text
            fontSize={20}
            weight="medium"
            numberOfLines={1}
            style={[text.center, flexbox.flex1]}
          >
            {t('Add custom network')}
          </Text>
        )}
        {selectedNetworkId !== 'add-custom-network' && !!selectedNetwork && (
          <>
            <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
              <NetworkIcon id={selectedNetwork.id} style={spacings.mrTy} size={40} />
              <Text appearance="secondaryText" weight="regular" style={spacings.mrMi} fontSize={16}>
                {selectedNetwork.name || t('Unknown network')}
              </Text>
            </View>
            <Text fontSize={20} weight="medium" numberOfLines={1}>
              {t('Edit network')}
            </Text>
            <View style={flexbox.flex1} />
          </>
        )}
      </View>
      <View style={[spacings.phXl, spacings.pvXl, spacings.ptLg, flexbox.flex1]}>
        <Text fontSize={18} weight="medium" style={spacings.mbMd}>
          {t('Network details')}
        </Text>
        <View style={[flexbox.directionRow, flexbox.flex1]}>
          <View style={flexbox.flex1}>
            <ScrollableWrapper contentContainerStyle={{ flexGrow: 1 }}>
              <View style={[flexbox.directionRow, flexbox.alignStart]}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 40 }}
                      containerStyle={{ ...spacings.mb, ...spacings.mrMi, flex: 1 }}
                      label={t('Network name')}
                      disabled={selectedNetworkId !== 'add-custom-network'}
                      error={handleErrors(errors.name)}
                    />
                  )}
                  name="name"
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 40 }}
                      containerStyle={{ ...spacings.mb, ...spacings.mlMi, flex: 1 }}
                      label={t('Currency Symbol')}
                      disabled={selectedNetworkId !== 'add-custom-network'}
                      error={handleErrors(errors.nativeAssetSymbol)}
                    />
                  )}
                  name="nativeAssetSymbol"
                />
              </View>

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[flexbox.directionRow, flexbox.alignStart]}>
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 40 }}
                      containerStyle={{ ...spacings.mb, ...spacings.mrTy, flex: 1 }}
                      label={t('RPC URL')}
                      error={handleErrors(errors.rpcUrl)}
                    />
                    <View style={{ paddingTop: 27 }}>
                      <Button
                        text={
                          value.length && !errors.rpcUrl && isValidatingRPC
                            ? t('Adding...')
                            : t('Add')
                        }
                        type="secondary"
                        disabled={
                          !value.length ||
                          (!!errors.rpcUrl &&
                            errors.rpcUrl.message !== 'At least one RPC URL should be added') ||
                          isValidatingRPC
                        }
                        containerStyle={{ height: 40 }}
                        style={{ height: 40 }}
                        onPress={() => handleAddRpcUrl(value)}
                      />
                    </View>
                  </View>
                )}
                name="rpcUrl"
              />

              <Text appearance="secondaryText" fontSize={14} weight="regular" style={spacings.mbMi}>
                {t('Select default RPC URL')}
              </Text>
              <ScrollableWrapper
                style={styles.rpcUrlsContainer}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {!!rpcUrls.length &&
                  rpcUrls.map((url, i) => {
                    return (
                      <RpcSelectorItem
                        key={url}
                        index={i}
                        url={url}
                        selectedRpcUrl={selectedRpcUrl}
                        rpcUrlsLength={rpcUrls.length}
                        onPress={handleSelectRpcUrl}
                        shouldShowRemove={
                          isPredefinedNetwork
                            ? !predefinedNetworks.find((n) => n.rpcUrls.includes(url))
                            : true
                        }
                        onRemove={handleRemoveRpcUrl}
                      />
                    )
                  })}
                {!rpcUrls.length && (
                  <View
                    style={[
                      flexbox.flex1,
                      flexbox.alignCenter,
                      flexbox.justifyCenter,
                      spacings.pvLg
                    ]}
                  >
                    <Text fontSize={14} style={text.center} appearance="secondaryText">
                      {t('No RPC URLs added yet')}
                    </Text>
                  </View>
                )}
              </ScrollableWrapper>
              <View style={[flexbox.directionRow, flexbox.alignStart]}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <NumberInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value as any}
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 40 }}
                      containerStyle={{ ...spacings.mrMi, flex: 1 }}
                      label={t('Chain ID')}
                      disabled={selectedNetworkId !== 'add-custom-network'}
                      error={handleErrors(errors.chainId)}
                    />
                  )}
                  name="chainId"
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 40 }}
                      containerStyle={{ ...spacings.mlMi, flex: 2 }}
                      label={t('Block Explorer URL')}
                      error={handleErrors(errors.explorerUrl)}
                    />
                  )}
                  name="explorerUrl"
                />
              </View>
              <View style={[flexbox.directionRow, flexbox.alignStart]}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <NumberInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value as any}
                      disabled
                      placeholder="Coming soon..."
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 40 }}
                      containerStyle={{ ...spacings.mrMi, flex: 1 }}
                      label={t('Coingecko platform ID')}
                      error={handleErrors(errors.coingeckoPlatformId)}
                    />
                  )}
                  name="coingeckoPlatformId"
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      disabled
                      placeholder="Coming soon..."
                      inputWrapperStyle={{ height: 40 }}
                      inputStyle={{ height: 40 }}
                      containerStyle={{ ...spacings.mlMi, flex: 1 }}
                      label={t('Coingecko native asset ID')}
                      error={handleErrors(errors.coingeckoNativeAssetId)}
                    />
                  )}
                  name="coingeckoNativeAssetId"
                />
              </View>
            </ScrollableWrapper>
          </View>
          <View style={[flexbox.flex1, spacings.pl, spacings.ml]}>
            <ScrollableWrapper contentContainerStyle={{ flexGrow: 1 }}>
              <View style={flexbox.flex1}>
                <NetworkAvailableFeatures networkId={selectedNetwork?.id} features={features} />

                {!!allowedToForce4337 && (
                  <View style={spacings.mtSm}>
                    <Controller
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          value={value!}
                          onValueChange={async (changedValue) => {
                            if (selectedNetwork) {
                              dispatch({
                                type: 'SETTINGS_CONTROLLER_SET_NETWORK_TO_ADD_OR_UPDATE',
                                params: {
                                  rpcUrl: selectedNetwork.selectedRpcUrl,
                                  chainId: selectedNetwork.chainId,
                                  force4337: changedValue
                                }
                              })
                            }

                            return onChange(changedValue)
                          }}
                          uncheckedBorderColor={theme.secondaryText}
                          label={t('Use ERC-4337 Account Abstraction')}
                          labelProps={{
                            style: {
                              color: theme.secondaryText,
                              fontSize: 16
                            },
                            weight: 'medium'
                          }}
                          style={[flexbox.directionRow, flexbox.alignCenter]}
                        />
                      )}
                      name="force4337"
                    />
                  </View>
                )}
              </View>
            </ScrollableWrapper>
            <View style={[flexbox.alignEnd, spacings.ptXl]}>
              {selectedNetworkId === 'add-custom-network' ? (
                <Button
                  onPress={handleSubmitButtonPress}
                  text={t('Add network')}
                  disabled={isSaveOrAddButtonDisabled}
                  hasBottomSpacing={false}
                  size="large"
                />
              ) : (
                <View style={[flexbox.directionRow]}>
                  <Button
                    onPress={onCancel}
                    text={t('Cancel')}
                    type="secondary"
                    hasBottomSpacing={false}
                    style={[flexbox.flex1, spacings.mr, { width: 160 }]}
                    size="large"
                  />

                  <Button
                    onPress={handleSubmitButtonPress}
                    text={isSomethingUpdated ? t('Save') : t('No changes')}
                    disabled={!isSomethingUpdated || isSaveOrAddButtonDisabled}
                    style={[spacings.mlMi, flexbox.flex1, { width: 180 }]}
                    hasBottomSpacing={false}
                    size="large"
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      <Tooltip id="chainId" />
    </>
  )
}

export default React.memo(NetworkForm)
