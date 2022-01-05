import React from 'react'
import { Image, Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import NumberInput from '@modules/common/components/NumberInput'
import Select from '@modules/common/components/Select'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useSendTransaction from '@modules/send/hooks/useSendTransaction'

import styles from './styles'

const SendScreen = ({ route, navigation }: any) => {
  const { tokens } = usePortfolio()
  const { asset, amount, setAsset, setAmount, setMaxAmount } = useSendTransaction(route, navigation)

  const assetsItems = tokens.map(({ label, symbol, address, img, tokenImageUrl }: any) => ({
    label: label || symbol,
    value: address,
    icon: () => <Image source={{ uri: img || tokenImageUrl }} style={{ width: 30, height: 30 }} />
  }))

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
      </View>
    </TouchableWithoutFeedback>
  )
}

export default SendScreen
