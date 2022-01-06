import React from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import Button from '@modules/common/components/Button'
import Input from '@modules/common/components/Input'
import NumberInput from '@modules/common/components/NumberInput'
import Select from '@modules/common/components/Select'
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
    sendTransaction
  } = useSendTransaction(route, navigation)

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss()
      }}
    >
      <View style={styles.container}>
        <Select value={asset} items={assetsItems} setValue={setAsset} />
        <NumberInput
          onChangeText={(v: any) => setAmount(v)}
          value={amount.toString()}
          buttonText="MAX"
          onButtonPress={setMaxAmount}
        />
        <Input
          placeholder="Recipient"
          info="Please double-check the recipient address, blockchain transactions are not reversible."
          value={address}
          onChangeText={setAddress}
        />
        <Button text="Send" onPress={sendTransaction} />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default SendScreen
