import React, { useCallback } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'

import { isiOS } from '@config/env'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Spinner from '@modules/common/components/Spinner'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import SendForm from '@modules/send/components/SendForm'
import useRequestTransaction from '@modules/send/hooks/useRequestTransaction'

const SendScreen = () => {
  const { addAddress } = useAddressBook()
  const {
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
    unknownWarning,
    smartContractWarning,
    showSWAddressWarning,
    sWAddressConfirmed,
    setSWAddressConfirmed,
    uDAddress,
    isCurrNetworkBalanceLoading
  } = useRequestTransaction()

  const handleSend = useCallback(() => {
    Keyboard.dismiss()
    sendTransaction()
  }, [sendTransaction])

  return (
    <GradientBackgroundWrapper>
      <Wrapper
        keyboardDismissMode="on-drag"
        type={isiOS ? WRAPPER_TYPES.KEYBOARD_AWARE_SCROLL_VIEW : WRAPPER_TYPES.SCROLL_VIEW}
        extraHeight={250}
        hasBottomTabNav
      >
        {isCurrNetworkBalanceLoading && (
          <View
            style={[
              StyleSheet.absoluteFill,
              flexboxStyles.alignCenter,
              flexboxStyles.justifyCenter
            ]}
          >
            <Spinner />
          </View>
        )}

        <SendForm
          isHidden={isCurrNetworkBalanceLoading}
          asset={asset}
          address={address}
          amount={amount}
          assetsItems={assetsItems}
          maxAmount={maxAmount}
          selectedAsset={selectedAsset}
          disabled={disabled}
          addressConfirmed={addressConfirmed}
          uDAddress={uDAddress}
          sWAddressConfirmed={sWAddressConfirmed}
          showSWAddressWarning={showSWAddressWarning}
          validationFormMgs={validationFormMgs}
          smartContractWarning={smartContractWarning}
          unknownWarning={unknownWarning}
          addAddress={addAddress}
          onSendPress={handleSend}
          setAsset={setAsset}
          onAmountChange={onAmountChange}
          setMaxAmount={setMaxAmount}
          setAddress={setAddress}
          setAddressConfirmed={setAddressConfirmed}
          setSWAddressConfirmed={setSWAddressConfirmed}
        />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default SendScreen
