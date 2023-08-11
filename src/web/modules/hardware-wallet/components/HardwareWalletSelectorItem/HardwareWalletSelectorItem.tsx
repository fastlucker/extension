import React from 'react'
import { ImageProps, ViewStyle } from 'react-native'

import Card from '@web/modules/auth/components/Card'

import styles from './styles'

type Props = {
  title: string
  text: string
  image?: ImageProps['source']
  onPress: () => void
  style?: ViewStyle
}

const HardwareWalletSelectorItem = ({ title, text, image, style, onPress }: Props) => {
  return (
    <Card
      style={[styles.itemContainer, style]}
      title={title}
      text={
        <>
          <strong>Supported</strong>: {text}
        </>
      }
      image={{
        source: image,
        style: styles.imageStyle
      }}
      onPress={onPress}
      buttonText={title}
    />
  )
}

export default HardwareWalletSelectorItem
