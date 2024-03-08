import React, { useCallback } from 'react'
import { View } from 'react-native'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import { TokenResult } from '@ambire-common/libs/portfolio'
import Checkbox from '@common/components/Checkbox'
import InputSendToken from '@common/components/InputSendToken'
import Recipient from '@common/components/Recipient'
import Select from '@common/components/Select/'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useAddressInput from '@common/hooks/useAddressInput'
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

const getSelectProps = ({
  tokens,
  token,
  isTopUp
}: {
  tokens: TokenResult[]
  token: string
  isTopUp: boolean
}) => {
  let options: any = []
  let value = null
  let tokenSelectDisabled = true
  let amountSelectDisabled = true

  if (tokens?.length === 0) {
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else {
    options = mapTokenOptions(tokens)
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
    isSWWarningVisible,
    tokens,
    validationFormMsgs,
    isSWWarningAgreed,
    isRecipientAddressUnknownAgreed,
    isTopUp
  } = state

  const { t } = useTranslation()
  const token = `${selectedToken?.address}-${selectedToken?.networkId}`
  const {
    value: tokenSelectValue,
    options,
    tokenSelectDisabled,
    amountSelectDisabled
  } = getSelectProps({ tokens, token, isTopUp })

  const disableForm = (!isSmartAccount && isTopUp) || !tokens.length

  console.log(options, disableForm)

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

  const onSWWarningCheckboxClick = useCallback(() => {
    updateTransferCtrlProperty('isSWWarningAgreed', true)
  }, [updateTransferCtrlProperty])

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
        style={styles.tokenSelect}
      />
      <InputSendToken
        amount={amount}
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
            setAddress={setFieldValue}
            validation={validation}
            address={addressState.fieldValue}
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
          />
        )}

        {isSWWarningVisible ? (
          <Checkbox
            value={isSWWarningAgreed}
            style={{ ...spacings.plTy, ...spacings.mb0 }}
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
