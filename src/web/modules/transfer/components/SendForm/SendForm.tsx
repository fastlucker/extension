import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import InputSendToken from '@common/components/InputSendToken'
import Recipient from '@common/components/Recipient'
import Select from '@common/components/Select/'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useDebounce from '@common/hooks/useDebounce'
import useToast from '@common/hooks/useToast'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { mapTokenOptions } from '@web/utils/maps'

import useTransferValidation from '../../hooks/useTransferValidation'
import styles from './styles'

const unsupportedSWPlatforms = ['Binance', 'Huobi', 'KuCoin', 'Gate.io', 'FTX']

const LOADING_TOKENS_ITEMS = [
  {
    value: 'loading',
    label: <Text weight="medium">Loading...</Text>,
    icon: null
  }
]

const NO_TOKENS_ITEMS = [
  {
    value: 'noTokens',
    label: <Text weight="medium">You don&apos;t have any tokens</Text>,
    icon: null
  }
]

const getSelectProps = ({
  tokens,
  isAllReady,
  token
}: {
  tokens: TokenResult[]
  isAllReady: boolean
  token: string
}) => {
  let options: any = []
  let value = null
  let selectDisabled = true

  if (isAllReady && tokens?.length > 0) {
    options = mapTokenOptions(tokens)
    value = options.find((item: any) => item.value === token) || options[0]
    selectDisabled = false
  } else if (isAllReady && !(tokens?.length > 0)) {
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else if (!isAllReady) {
    value = LOADING_TOKENS_ITEMS[0]
    options = LOADING_TOKENS_ITEMS
  }

  return {
    options,
    value,
    selectDisabled
  }
}
const SendForm = ({ state, isAllReady = false }: any) => {
  const { addToast } = useToast()
  const { dispatch } = useBackgroundService()
  const {
    amount,
    maxAmount,
    selectedToken,
    recipientUDAddress,
    recipientEnsAddress,
    recipientAddress,
    userRequest,
    isRecipientAddressUnknown,
    isRecipientSmartContract,
    isRecipientDomainResolving,
    isSWWarningVisible,
    tokens
  } = state

  const { t } = useTranslation()
  const token = `${selectedToken?.address}-${selectedToken?.networkId}`
  const {
    value: tokenSelectValue,
    options,
    selectDisabled
  } = getSelectProps({ tokens, isAllReady, token })
  const { control, watch } = useForm({
    defaultValues: {
      isRecipientAddressUnknownAgreed: false,
      isSWWarningAgreed: false
    }
  })
  const debouncedRecipientAddress = useDebounce({ value: recipientAddress, delay: 500 })
  const isRecipientAddressUnknownAgreed = watch('isRecipientAddressUnknownAgreed')
  const isSWWarningAgreed = watch('isSWWarningAgreed')
  const { disabled, validationFormMsgs } = useTransferValidation({
    ...state,
    recipientAddress: debouncedRecipientAddress,
    isRecipientAddressUnknownAgreed,
    isSWWarningAgreed
  })

  const handleChangeToken = useCallback(
    (value: string) =>
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_HANDLE_TOKEN_CHANGE',
        params: {
          tokenAddressAndNetwork: value
        }
      }),
    [dispatch]
  )

  const setAmount = useCallback(
    (value: string) =>
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_SET_AMOUNT',
        params: {
          amount: value
        }
      }),
    [dispatch]
  )

  const setMaxAmount = useCallback(
    () =>
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_SET_MAX_AMOUNT'
      }),
    [dispatch]
  )

  const sendTransaction = useCallback(async () => {
    await dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_BUILD_USER_REQUEST'
    })
  }, [dispatch])

  const setRecipientAddress = useCallback(
    (value: string) =>
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_SET_RECIPIENT_ADDRESS',
        params: {
          recipientAddress: value
        }
      }),
    [dispatch]
  )

  useEffect(() => {
    try {
      if (!userRequest) return

      dispatch({
        type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
        params: userRequest
      })

      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_RESET'
      })
    } catch (e: any) {
      console.error(e)
      addToast(`Error: ${e.message || e}`, { error: true })
    }
  }, [userRequest, addToast, dispatch])

  useEffect(() => {
    if (!debouncedRecipientAddress) return
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_ON_RECIPIENT_ADDRESS_CHANGE'
    })
  }, [debouncedRecipientAddress, dispatch])

  return (
    <View style={styles.container}>
      <Select
        setValue={({ value }) => handleChangeToken(value)}
        label={t('Select Token')}
        options={options}
        value={tokenSelectValue}
        disabled={selectDisabled}
        style={styles.tokenSelect}
      />
      <InputSendToken
        amount={amount}
        selectedTokenSymbol={isAllReady ? selectedToken?.symbol || t('Unknown') : ''}
        errorMessage={validationFormMsgs?.messages?.amount || ''}
        onAmountChange={setAmount}
        setMaxAmount={setMaxAmount}
        maxAmount={!selectDisabled ? Number(maxAmount) : null}
      />
      <View style={styles.recipientWrapper}>
        <Recipient
          setAddress={setRecipientAddress}
          address={recipientAddress}
          uDAddress={recipientUDAddress}
          ensAddress={recipientEnsAddress}
          addressValidationMsg={validationFormMsgs?.messages?.address || ''}
          control={control}
          isRecipientSmartContract={isRecipientSmartContract}
          isRecipientAddressUnknown={isRecipientAddressUnknown}
          isRecipientDomainResolving={isRecipientDomainResolving}
        />

        {isSWWarningVisible ? (
          <Controller
            name="isSWWarningAgreed"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                style={styles.sWAddressWarningCheckbox}
                value={value}
                onValueChange={onChange}
              >
                <Text fontSize={12} onPress={() => onChange(!value)}>
                  {
                    t(
                      'I confirm this address is not a {{platforms}} address: These platforms do not support {{token}} deposits from smart wallets.',
                      {
                        platforms: unsupportedSWPlatforms.join(' / '),
                        token: selectedToken?.symbol
                      }
                    ) as string
                  }
                </Text>
              </Checkbox>
            )}
          />
        ) : null}
      </View>

      <Button
        type="primary"
        size="large"
        text={t('Send')}
        disabledStyle={{ opacity: 0.6 }}
        style={styles.button}
        onPress={sendTransaction}
        disabled={disabled}
      />
    </View>
  )
}

export default SendForm
