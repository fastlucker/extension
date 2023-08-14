import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings, { SPACING_LG } from '@common/styles/spacings'
import Select from '@common/components/Select/'
import flexbox from '@common/styles/utils/flexbox'
import NumberInput from '@common/components/NumberInput'
import RecipientInput from '@common/components/RecipientInput'
import Checkbox from '@common/components/Checkbox'
import Button from '@common/components/Button'
import { Controller, useForm } from 'react-hook-form'
import { AuthLayoutWrapperMainContent } from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'

// @TODO: - get tokens from portfolio based on currently selected account
const TOKENS = [
  {
    // @TODO: - we need to show network icon in front of network name,
    //   https://github.com/AmbireTech/ambire-app/pull/1170#discussion_r1293243396
    label: 'USDC on Ethereum',
    value: 'usdc',
    icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    label: 'Matic on Polygon',
    value: 'matic',
    icon: 'https://storage.googleapis.com/zapper-fi-assets/tokens/polygon/0x0000000000000000000000000000000000001010.png'
  }
]

const TransferScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  const {
    handleSubmit,
    control,
    // @TODO: Error handling for amount and recipient fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors }
  } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      token: TOKENS[0],
      amount: '0',
      recipientAddr: ''
    }
  })
  const [confirmedNotExchangeAddr, onConfirmNotExchangeAddr] = useState(false)

  const onBack = useCallback(() => {
    navigate(ROUTES.dashboard)
  }, [handleSubmit])

  const handleFormSubmit = useCallback(() => {
    handleSubmit(async (data) => {
      // @TODO: create UserReq/AccountOp and navigates to Sign Transaction
      console.log({ data })
    })()
  }, [handleSubmit])

  return (
    <AuthLayoutWrapperMainContent fullWidth forceCanGoBack onBack={onBack}>
      <View style={[flexbox.alignCenter, spacings.pv]}>
        <View style={[flexbox.flex1, { maxWidth: 500 }]}>
          <Controller
            name="token"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                setValue={onChange}
                label="Select Token"
                options={TOKENS}
                style={{ ...spacings.mb }}
                value={value}
                defaultValue={value}
              />
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field: { onChange, value } }) => (
              <NumberInput
                style={[spacings.phTy, { width: '100%' }]}
                containerStyle={[spacings.mb]}
                label="Select Amount"
                button="MAX"
                onButtonPress={onChange}
                defaultValue={value}
              />
            )}
          />

          <Controller
            name="recipientAddr"
            control={control}
            render={({ field: { onChange, value } }) => (
              <RecipientInput
                style={[spacings.phTy, { width: '100%' }]}
                containerStyle={[spacings.mb]}
                label="Add Recipient"
                onChange={onChange}
                value={value}
              />
            )}
          />

          <Text style={[spacings.mb]} fontSize={14}>
            {t(
              'Please double-check the recipient address, blockchain transactions are not reversible.'
            )}
          </Text>

          <Checkbox
            value={confirmedNotExchangeAddr}
            onValueChange={() => onConfirmNotExchangeAddr((prev) => !prev)}
            label="I confirm this address is not a Binance/Huobi/KuCoin/Gate.io/FTX address: These platforms do not support $MATIC deposit from smart wallets."
          />

          {/* // @TODO: disabled reason */}
          <Button
            type="primary"
            size="large"
            text="Send"
            style={[
              flexbox.alignSelfStart,
              { paddingLeft: SPACING_LG * 4, paddingRight: SPACING_LG * 4 }
            ]}
            onPress={handleFormSubmit}
            disabled={!confirmedNotExchangeAddr}
          />
        </View>
      </View>
    </AuthLayoutWrapperMainContent>
  )
}

export default TransferScreen
