import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import { TokenResult } from '@ambire-common/libs/portfolio'
import InputSendToken from '@common/components/InputSendToken'
import Recipient from '@common/components/Recipient'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useAddressInput from '@common/hooks/useAddressInput'
import usePrevious from '@common/hooks/usePrevious'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { mapTokenOptions } from '@web/utils/maps'

import styles from './styles'

const NO_TOKENS_ITEMS = [
  {
    value: 'noTokens',
    label: (
      <Text weight="medium" fontSize={14}>
        You don&apos;t have any tokens
      </Text>
    ),
    icon: null
  }
]

const getTokenAddressAndNetworkFromId = (id: string) => {
  const [address, networkId, symbol] = id.split('-')
  return [address, networkId, symbol]
}

const getSelectProps = ({
  tokens,
  token,
  isTopUp,
  networks
}: {
  tokens: TokenResult[]
  token: string
  isTopUp: boolean
  networks: NetworkDescriptor[]
}) => {
  let options: any = []
  let value = null
  let tokenSelectDisabled = true
  let amountSelectDisabled = true

  if (tokens?.length === 0) {
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else {
    options = mapTokenOptions(tokens, networks)
    value = options.find((item: any) => item.value === token) || options[0]
    tokenSelectDisabled = isTopUp
    amountSelectDisabled = false
  }

  return {
    options,
    value,
    tokenSelectDisabled,
    amountSelectDisabled
  }
}
const SendForm = ({
  addressInputState,
  state,
  isAllReady = false,
  isSmartAccount = false
}: {
  addressInputState: ReturnType<typeof useAddressInput>
  state: TransferControllerState
  isSmartAccount: boolean
  isAllReady?: boolean
}) => {
  const { dispatch } = useBackgroundService()
  const { validation, setFieldValue } = addressInputState
  const {
    amount,
    maxAmount,
    selectedToken,
    addressState,
    isRecipientAddressUnknown,
    isRecipientHumanizerKnownTokenOrSmartContract,
    tokens,
    validationFormMsgs,
    isSWWarningVisible,
    isSWWarningAgreed,
    isRecipientAddressUnknownAgreed,
    isTopUp
  } = state

  const { t } = useTranslation()
  const { networks } = useSettingsControllerState()
  const token = `${selectedToken?.address}-${selectedToken?.networkId}-${selectedToken?.symbol}`
  const {
    value: tokenSelectValue,
    options,
    tokenSelectDisabled,
    amountSelectDisabled
  } = getSelectProps({ tokens, token, isTopUp, networks })

  const disableForm = (!isSmartAccount && isTopUp) || !tokens.length

  const prevAmount = usePrevious(amount)
  // duplicating the value from the controller to the react
  // state resolves an issue with the cursor positioning in the field
  const [amountFieldValue, setAmountFieldValue] = useState(amount)

  useEffect(() => {
    if (prevAmount !== amount) if (amountFieldValue !== amount) setAmountFieldValue(amount)
  }, [amount, amountFieldValue, prevAmount])

  const prevAddressValue = usePrevious(addressState.fieldValue)
  // duplicating the value from the controller to the react
  // state resolves an issue with the cursor positioning in the field
  const [addressFieldValue, setAddressFieldValue] = useState(addressState.fieldValue)

  useEffect(() => {
    if (prevAddressValue !== addressState.fieldValue)
      if (addressFieldValue !== addressState.fieldValue)
        setAddressFieldValue(addressState.fieldValue)
  }, [addressState.fieldValue, addressFieldValue, prevAddressValue])

  const handleChangeToken = useCallback(
    (value: string) => {
      const tokenToSelect = tokens.find(
        (tokenRes: TokenResult) =>
          tokenRes.address === getTokenAddressAndNetworkFromId(value)[0] &&
          tokenRes.networkId === getTokenAddressAndNetworkFromId(value)[1] &&
          tokenRes.symbol === getTokenAddressAndNetworkFromId(value)[2]
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
      setAmountFieldValue(newAmount)
      updateTransferCtrlProperty('amount', newAmount)
    },
    [updateTransferCtrlProperty]
  )

  const onAddressChange = useCallback(
    (newAddressValue: string) => {
      setAddressFieldValue(newAddressValue)
      setFieldValue(newAddressValue)
    },
    [setFieldValue]
  )

  const setMaxAmount = useCallback(() => {
    updateTransferCtrlProperty('amount', maxAmount)
  }, [updateTransferCtrlProperty, maxAmount])

  const onRecipientAddressUnknownCheckboxClick = useCallback(() => {
    updateTransferCtrlProperty('isRecipientAddressUnknownAgreed', true)
  }, [updateTransferCtrlProperty])

  return (
    <View style={[styles.container, isTopUp ? styles.topUpContainer : {}]}>
      <Select
        setValue={({ value }) => handleChangeToken(value)}
        label={t('Select Token')}
        options={options}
        value={tokenSelectValue}
        disabled={tokenSelectDisabled || disableForm}
        containerStyle={styles.tokenSelect}
      />
      <InputSendToken
        amount={amountFieldValue}
        selectedTokenSymbol={isAllReady ? selectedToken?.symbol || t('Unknown') : ''}
        errorMessage={validationFormMsgs?.amount.message}
        onAmountChange={onAmountChange}
        setMaxAmount={setMaxAmount}
        maxAmount={!amountSelectDisabled ? Number(maxAmount) : null}
        disabled={disableForm}
      />
      <View>
        {!isTopUp && (
          <Recipient
            disabled={disableForm}
            setAddress={onAddressChange}
            validation={validation}
            address={addressFieldValue}
            uDAddress={addressState.udAddress}
            ensAddress={addressState.ensAddress}
            addressValidationMsg={validationFormMsgs?.recipientAddress.message}
            isRecipientHumanizerKnownTokenOrSmartContract={
              isRecipientHumanizerKnownTokenOrSmartContract
            }
            isRecipientAddressUnknown={isRecipientAddressUnknown}
            isRecipientDomainResolving={addressState.isDomainResolving}
            isRecipientAddressUnknownAgreed={isRecipientAddressUnknownAgreed}
            onRecipientAddressUnknownCheckboxClick={onRecipientAddressUnknownCheckboxClick}
            isSWWarningVisible={isSWWarningVisible}
            isSWWarningAgreed={isSWWarningAgreed}
            selectedTokenSymbol={selectedToken?.symbol}
          />
        )}
      </View>
    </View>
  )
}

export default React.memo(SendForm)
