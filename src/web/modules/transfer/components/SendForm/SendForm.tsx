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

const unsupportedSWPlatforms = ['Binance', 'Huobi', 'KuCoin', 'Gate.io', 'FTX']

const SendForm = ({
  requestTransactionState: {
    asset,
    amount,
    address,
    assetsItems,
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
    ensAddress,
    isLoading
  }
}: any) => {
  if (isLoading) return null

  const { t } = useTranslation()
  const selectedAssetSelectItem = assetsItems.find((item: any) => item.value === asset)

  return (
    <View style={[flexbox.flex1, spacings.pbLg, { maxWidth: 500 }]}>
      <Select
        setValue={({ value }) => setAsset(value)}
        label="Select Token"
        options={assetsItems}
        style={{ ...spacings.mbXl }}
        value={selectedAssetSelectItem || assetsItems[0]}
        defaultValue={assetsItems[0]}
      />
      <InputSendToken
        amount={amount}
        selectedAssetSymbol={selectedAsset?.symbol || 'Unknown'}
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
