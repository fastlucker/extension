import React from 'react'
import { Image, ViewStyle } from 'react-native'

import Card from '@web/modules/auth/components/Card'
import Button from '@common/components/Button'

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
      text={text}
      style={[styles.itemContainer, style]}
      icon={
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
    >
      <Button text={name} onPress={onSelect} />
    </Card>
  )
}

export default HardwareWalletSelectorItem
