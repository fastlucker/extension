import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import { TokenResult } from '@ambire-common/libs/portfolio'
import Checkbox from '@common/components/Checkbox'
import InputSendToken from '@common/components/InputSendToken'
import Recipient from '@common/components/Recipient'
import Select from '@common/components/Select/'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useDebounce from '@common/hooks/useDebounce'
import spacings from '@common/styles/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { mapTokenOptions } from '@web/utils/maps'

import styles from './styles'

const unsupportedSWPlatforms = ['Binance', 'Huobi', 'KuCoin', 'Gate.io', 'FTX']

const NO_TOKENS_ITEMS = [
  {
    value: 'noTokens',
    label: <Text weight="medium">You don&apos;t have any tokens</Text>,
    icon: null
  }
]

const getTokenAddressAndNetworkFromId = (id: string) => {
  const [address, networkId] = id.split('-')
  return [address, networkId]
}

const getSelectProps = ({ tokens, token }: { tokens: TokenResult[]; token: string }) => {
  let options: any = []
  let value = null
  let selectDisabled = true

  if (tokens?.length === 0) {
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else {
    options = mapTokenOptions(tokens)
    value = options.find((item: any) => item.value === token) || options[0]
    selectDisabled = false
  }

  return {
    options,
    value,
    selectDisabled
  }
}
const SendForm = ({
  state,
  isAllReady = false
}: {
  state: TransferControllerState
  isAllReady?: boolean
}) => {
  const { dispatch } = useBackgroundService()
  const {
    amount,
    maxAmount,
    selectedToken,
    recipientUDAddress,
    recipientEnsAddress,
    recipientAddress,
    isRecipientAddressUnknown,
    isRecipientSmartContract,
    isRecipientDomainResolving,
    isSWWarningVisible,
    tokens,
    validationFormMsgs,
    isSWWarningAgreed,
    isRecipientAddressUnknownAgreed
  } = state

  const { t } = useTranslation()
  const token = `${selectedToken?.address}-${selectedToken?.networkId}`
  const { value: tokenSelectValue, options, selectDisabled } = getSelectProps({ tokens, token })
  const debouncedRecipientAddress = useDebounce({ value: recipientAddress, delay: 500 })

  const handleChangeToken = useCallback(
    (value: string) => {
      const tokenToSelect = tokens.find(
        (tokenRes: TokenResult) =>
          tokenRes.address === getTokenAddressAndNetworkFromId(value)[0] &&
          tokenRes.networkId === getTokenAddressAndNetworkFromId(value)[1]
      )
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
        params: {
          selectedToken: tokenToSelect
        }
      })
    },
    [dispatch, tokens]
  )

  const updateTransferCtrlProperty = useCallback(
    (key: string, value: string | boolean) =>
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
        params: {
          [key]: value
        }
      }),
    [dispatch]
  )

  const onAmountChange = useCallback(
    (newAmount: string) => {
      updateTransferCtrlProperty('amount', newAmount)
    },
    [updateTransferCtrlProperty]
  )

  const setMaxAmount = useCallback(() => {
    updateTransferCtrlProperty('amount', maxAmount)
  }, [updateTransferCtrlProperty, maxAmount])

  const setRecipientAddress = useCallback(
    (text: string) => {
      updateTransferCtrlProperty('recipientAddress', text)
    },
    [updateTransferCtrlProperty]
  )

  const onSWWarningCheckboxClick = useCallback(() => {
    updateTransferCtrlProperty('isSWWarningAgreed', true)
  }, [updateTransferCtrlProperty])

  const onRecipientAddressUnknownCheckboxClick = useCallback(() => {
    updateTransferCtrlProperty('isRecipientAddressUnknownAgreed', true)
  }, [updateTransferCtrlProperty])

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
        errorMessage={validationFormMsgs?.amount.message}
        onAmountChange={onAmountChange}
        setMaxAmount={setMaxAmount}
        maxAmount={!selectDisabled ? Number(maxAmount) : null}
      />
      <View>
        <Recipient
          setAddress={setRecipientAddress}
          address={recipientAddress}
          uDAddress={recipientUDAddress}
          ensAddress={recipientEnsAddress}
          addressValidationMsg={validationFormMsgs?.recipientAddress.message}
          isRecipientSmartContract={isRecipientSmartContract}
          isRecipientAddressUnknown={isRecipientAddressUnknown}
          isRecipientDomainResolving={isRecipientDomainResolving}
          isRecipientAddressUnknownAgreed={isRecipientAddressUnknownAgreed}
          onRecipientAddressUnknownCheckboxClick={onRecipientAddressUnknownCheckboxClick}
        />

        {isSWWarningVisible ? (
          <Checkbox
            value={isSWWarningAgreed}
            style={spacings.plTy}
            onValueChange={onSWWarningCheckboxClick}
          >
            <Text fontSize={12} onPress={onSWWarningCheckboxClick}>
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
        ) : null}
      </View>
    </View>
  )
}

export default React.memo(SendForm)
