import { TokenResult } from 'ambire-common/src/libs/portfolio'
import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import InputSendToken from '@common/components/InputSendToken'
import Recipient from '@common/components/Recipient'
import Select from '@common/components/Select/'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings, { SPACING_LG } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import { mapTokenOptions } from '@web/utils/maps'

const unsupportedSWPlatforms = ['Binance', 'Huobi', 'KuCoin', 'Gate.io', 'FTX']

const LOADING_ASSETS_ITEMS = [
  {
    value: 'loading',
    label: <Text weight="medium">Loading...</Text>,
    icon: null
  }
]

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
  const assetsItems = mapTokenOptions(tokens as TokenResult[])

  const selectedAssetSelectItem = assetsItems.find((item: any) => item.value === asset)

  return (
    <View style={[flexbox.flex1, spacings.pbLg, { maxWidth: 500 }]}>
      <Select
        setValue={({ value }) => setAsset(value)}
        label="Select Token"
        options={isAllReady ? assetsItems : LOADING_ASSETS_ITEMS}
        style={{ ...spacings.mbXl }}
        value={isAllReady ? selectedAssetSelectItem || assetsItems[0] : LOADING_ASSETS_ITEMS[0]}
        defaultValue={isAllReady ? assetsItems[0] : LOADING_ASSETS_ITEMS[0]}
      />
      <InputSendToken
        amount={amount}
        selectedAssetSymbol={isAllReady ? selectedAsset?.symbol || 'Unknown' : ''}
        maxAmount={Number(maxAmount)}
        errorMessage={validationFormMgs?.messages?.amount || ''}
        onAmountChange={onAmountChange}
        setMaxAmount={setMaxAmount}
      />
      <View style={spacings.mbXl}>
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
            style={[spacings.mlTy, spacings.mbLg]}
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
        text="Send"
        disabledStyle={{ opacity: 0.6 }}
        style={[flexbox.alignSelfStart, { width: 300, paddingHorizontal: SPACING_LG * 4 }]}
        onPress={sendTransaction}
        disabled={disabled}
      />
    </View>
  )
}

export default SendForm
