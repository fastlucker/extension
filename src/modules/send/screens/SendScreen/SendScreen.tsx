import React from 'react'
import { ActivityIndicator, Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import NumberInput from '@modules/common/components/NumberInput'
import Select from '@modules/common/components/Select'
import Text from '@modules/common/components/Text'
import useSendTransaction from '@modules/send/hooks/useSendTransaction'

import styles from './styles'

const SendScreen = ({ route, navigation }: any) => {
  const {
    asset,
    amount,
    address,
    assetsItems,
    setAsset,
    setAmount,
    setMaxAmount,
    setAddress,
    sendTransaction,
    isBalanceLoading,
    disabled,
    validationFormMgs
  } = useSendTransaction(route, navigation)

  return (
    <>
      {isBalanceLoading && <ActivityIndicator />}
      {!isBalanceLoading && (
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
          }}
        >
          {assetsItems.length ? (
            <View style={styles.container}>
              <Select value={asset} items={assetsItems} setValue={setAsset} />
              <NumberInput
                onChangeText={(v: any) => setAmount(v)}
                value={amount.toString()}
                buttonText="MAX"
                onButtonPress={setMaxAmount}
              />
              {!!validationFormMgs.messages?.amount && (
                <Text>&nbsp;{validationFormMgs.messages.amount}</Text>
              )}
              <Input
                placeholder="Recipient"
                info="Please double-check the recipient address, blockchain transactions are not reversible."
                value={address}
                onChangeText={setAddress}
              />
              <Button text="Send" disabled={disabled} onPress={sendTransaction} />
            </View>
          ) : (
            <Text>You don't have any funds on this account.</Text>
          )}
        </TouchableWithoutFeedback>
      )}
    </>
  )
}

export default SendScreen
