import React from 'react'
import { Image, ViewStyle } from 'react-native'

import Card from '@web/modules/auth/components/Card'

import styles from './styles'

type Props = {
  name: string
  text: string
  icon: JSX.Element
  onSelect: () => void
  style?: ViewStyle
}

const HardwareWalletSelectorItem = ({ name, text, icon, style, onSelect }: Props) => {
  return (
    <Card
      onPress={onSelect}
      text={text}
      style={[styles.itemContainer, style]}
      image={
        <Image
          source={icon}
          style={{
            height: 136,
            width: 120,
            marginBottom: 27,
            alignSelf: 'center'
          }}
          resizeMode="contain"
        />
      }
      buttonText={name}
    />
  )
}

export default HardwareWalletSelectorItem
