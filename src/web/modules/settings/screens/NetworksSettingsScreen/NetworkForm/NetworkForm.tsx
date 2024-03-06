import { getCreate2Address, Interface, JsonRpcProvider, keccak256 } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import DeployHelper from '@ambire-common/../contracts/compiled/DeployHelperStaging.json'
import { SINGLETON } from '@ambire-common/consts/deploy'
import { networks as constantNetworks } from '@ambire-common/consts/networks'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { NetworkPreference } from '@ambire-common/interfaces/settings'
import { UserRequest } from '@ambire-common/interfaces/userRequest'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import AddIcon from '@common/assets/svg/AddIcon'
import Button from '@common/components/Button'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
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
  const { t } = useTranslation()
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
  const { selectedAccount, accounts } = useMainControllerState()
  const { theme } = useTheme()
  const { maxWidthSize } = useWindowSize()
  const [isLoadingRPC, setIsLoadingRPC] = useState(false)
  const [deployError, setDeployError] = useState('')
  const [shouldShowDeployBtn, setShouldShowDeployBtn] = useState(false)
  const networkFormValues = watch()
  const isWidthXl = maxWidthSize('xl')

  const areDefaultValuesChanged = getAreDefaultsChanged(networkFormValues, selectedNetwork)

  useEffect(() => {
    // We can't just validate using a custom validate rule, because getNetwork is async
    // and resetting the form doesn't wait for the validation to finish so we get an error
    // when resetting the form.
    const subscription = watch(async (value, { name }) => {
      if (name !== 'rpcUrl') return

      try {
        setIsLoadingRPC(true)
        const rpc = new JsonRpcProvider(value.rpcUrl)
        const network = await rpc.getNetwork()

        if (network.chainId !== selectedNetwork?.chainId) {
          setIsLoadingRPC(false)
          setError('rpcUrl', {
            type: 'custom',
            message: `RPC chain id ${network.chainId} does not match ${selectedNetwork?.name} chain id ${selectedNetwork?.chainId}`
          })
          return
        }
        setIsLoadingRPC(false)
        clearErrors('rpcUrl')
      } catch {
        setIsLoadingRPC(false)
        setError('rpcUrl', { type: 'custom', message: 'Invalid RPC URL' })
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [selectedNetwork?.chainId, selectedNetwork?.name, setError, watch, clearErrors])

  useEffect(() => {
    setShouldShowDeployBtn(false)
    if (!selectedNetwork) return

    // run a simulation, take the contract addresses and verify there's no code there
    const salt = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const helperAddr = getCreate2Address(SINGLETON, salt, keccak256(DeployHelper.bin))
    const provider = new JsonRpcProvider(selectedNetwork.rpcUrl)
    provider
      .getCode(helperAddr)
      .then((code) => {
        if (code === '0x') {
          setShouldShowDeployBtn(true)
        }
      })
      .catch(() => null)
  }, [selectedNetwork])

  const handleSave = () => {
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

  const handleDeploy = async () => {
    // this should not happen...
    if (!selectedNetwork && !selectedNetworkId) {
      setDeployError('No network selected. Please select a network and try again')
      setTimeout(() => setDeployError(''), 5000)
      return
    }

    // we need an account
    if (!selectedAccount) {
      setDeployError('No account selected. Please select a basic account and try again')
      setTimeout(() => setDeployError(''), 5000)
      return
    }

    // we need a basic account
    const account = accounts.find((acc) => acc.addr === selectedAccount)
    if (!account) {
      setDeployError('No account selected. Please select a basic account and try again')
      setTimeout(() => setDeployError(''), 5000)
      return
    }
    if (isSmartAccount(account)) {
      setDeployError(
        'Deploy cannot be made with a smart account. Please select a basic account and try again'
      )
      setTimeout(() => setDeployError(''), 5000)
      return
    }

    const network = selectedNetwork ?? networks.find((net) => net.id === selectedNetworkId)!
    const bytecode = DeployHelper.bin
    const salt = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const singletonAddr = '0xce0042B868300000d44A59004Da54A005ffdcf9f'
    const singletonABI = [
      {
        inputs: [
          { internalType: 'bytes', name: '_initCode', type: 'bytes' },
          { internalType: 'bytes32', name: '_salt', type: 'bytes32' }
        ],
        name: 'deploy',
        outputs: [{ internalType: 'address payable', name: 'createdContract', type: 'address' }],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]
    const singletonInterface = new Interface(singletonABI)
    const txn = {
      kind: 'call' as const,
      to: singletonAddr,
      value: 0n,
      data: singletonInterface.encodeFunctionData('deploy', [bytecode, salt])
    }

    const userRequest: UserRequest = {
      id: new Date().getTime(),
      networkId: network.id,
      accountAddr: selectedAccount,
      forceNonce: null,
      action: txn
    }

    dispatch({
      type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
      params: userRequest
    })
  }

  const handleResetNetworkField = (preferenceKey: keyof NetworkPreference) => {
    dispatch({
      type: 'MAIN_CONTROLLER_RESET_NETWORK_PREFERENCE',
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
        isWidthXl ? spacings.plXl : spacings.plLg,
        isWidthXl ? spacings.mlXl : spacings.mlLg,
        { borderLeftWidth: 1, borderColor: theme.secondaryBorder }
      ]}
    >
      <View style={spacings.mb}>
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

              return (
                <Input
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  disabled={!inputField.editable && selectedNetworkId !== 'custom'}
                  isValid={!errors[inputField.name as keyof typeof errors] && inputField.editable}
                  error={
                    inputField.name === 'rpcUrl' && isLoadingRPC
                      ? false
                      : handleErrors(errors[inputField.name as keyof typeof errors])
                  }
                  containerStyle={index + 1 !== INPUT_FIELDS.length ? spacings.mbLg : {}}
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

        <Pressable
          onPress={handleDeploy}
          style={{
            marginLeft: 'auto',
            ...spacings.mb,
            ...flexboxStyles.directionRow,
            ...flexboxStyles.alignCenter,
            opacity: shouldShowDeployBtn ? 1 : 0
          }}
          disabled={!shouldShowDeployBtn}
        >
          <Text weight="medium" appearance="secondaryText" fontSize={14} style={spacings.mrTy}>
            Deploy Contracts
          </Text>
          <AddIcon width={16} height={16} color={theme.secondaryText} />
        </Pressable>
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
          text={t('Cancel')}
          type="secondary"
          disabled={!areDefaultValuesChanged}
          style={[spacings.mb0, spacings.mlSm, { width: 120 }]}
        />
        <Button
          onPress={handleSave}
          text={t('Save')}
          disabled={!areDefaultValuesChanged || !isValid || !!errors?.rpcUrl || isLoadingRPC}
          style={[spacings.mb0, spacings.mlSm, { width: 200 }]}
        />
      </View>
      {!!deployError && (
        <View style={[spacings.mtSm, flexboxStyles.alignCenter]}>
          <Text fontSize={12} appearance="errorText">
            {deployError}
          </Text>
        </View>
      )}
    </View>
  )
}

export default NetworkForm
