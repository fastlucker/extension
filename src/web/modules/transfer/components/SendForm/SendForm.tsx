import React from 'react'
import { View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import InputSendToken from '@common/components/InputSendToken'
import Recipient from '@common/components/Recipient'
import Select from '@common/components/Select/'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { mapTokenOptions } from '@web/utils/maps'

import styles from './styles'

const unsupportedSWPlatforms = ['Binance', 'Huobi', 'KuCoin', 'Gate.io', 'FTX']

const LOADING_ASSETS_ITEMS = [
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
  asset
}: {
  tokens: TokenResult[]
  isAllReady: boolean
  asset: string
}) => {
  let options: any = []
  let value = null
  let selectDisabled = true

  if (isAllReady && tokens?.length > 0) {
    options = mapTokenOptions(tokens)
    value = options.find((item: any) => item.value === asset) || options[0]
    selectDisabled = false
  } else if (isAllReady && !(tokens?.length > 0)) {
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else if (!isAllReady) {
    value = LOADING_ASSETS_ITEMS[0]
    options = LOADING_ASSETS_ITEMS
  }

  return {
    options,
    value,
    selectDisabled
  }
}

const SendForm = ({
  requestTransactionState: {
    asset,
    amount,
    address,
    setAsset,
    selectedAsset,
    onAmountChange,
    maxAmount,
    setMaxAmount,
    setAddress,
    sendTransaction,
    disabled,
    addressConfirmed,
    setAddressConfirmed,
    validationFormMgs,
    showSWAddressWarning,
    sWAddressConfirmed,
    setSWAddressConfirmed,
    uDAddress,
    ensAddress
  }
}: any) => {
  const {
    // When we dispatch the new transaction the main controller updates
    // which sets the tokens to null and isAllReady to false. This results in blinking in the UI
    // so we have to check if the portfolio is loading and show a loading state if it is.
    accountPortfolio: { tokens, isAllReady }
  } = usePortfolioControllerState()
  const { t } = useTranslation()
  const { value, options, selectDisabled } = getSelectProps({ tokens, isAllReady, asset })

  return (
    <View style={styles.container}>
      <Select
        setValue={({ value: newValue }) => setAsset(newValue)}
        label={t('Select Token')}
        options={options}
        value={value}
        disabled={selectDisabled}
        style={styles.tokenSelect}
      />
      <InputSendToken
        amount={amount}
        selectedAssetSymbol={isAllReady ? selectedAsset?.symbol || t('Unknown') : ''}
        errorMessage={validationFormMgs?.messages?.amount || ''}
        onAmountChange={onAmountChange}
        setMaxAmount={setMaxAmount}
        maxAmount={!selectDisabled ? Number(maxAmount) : null}
      />
      <View style={styles.recipientWrapper}>
        <Recipient
          setAddress={setAddress}
          address={address}
          uDAddress={uDAddress}
          ensAddress={ensAddress}
          addressValidationMsg={validationFormMgs?.messages?.address || ''}
          setAddressConfirmed={setAddressConfirmed}
          addressConfirmed={addressConfirmed}
        />

        {showSWAddressWarning && (
          <Checkbox
            style={styles.sWAddressWarningCheckbox}
            value={sWAddressConfirmed}
            onValueChange={() => setSWAddressConfirmed(!sWAddressConfirmed)}
          >
            <Text fontSize={12} onPress={() => setSWAddressConfirmed(!sWAddressConfirmed)}>
              {
                t(
                  'I confirm this address is not a {{platforms}} address: These platforms do not support {{token}} deposits from smart wallets.',
                  {
                    platforms: unsupportedSWPlatforms.join(' / '),
                    token: selectedAsset?.label
                  }
                ) as string
              }
            </Text>
          </Checkbox>
        )}
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
