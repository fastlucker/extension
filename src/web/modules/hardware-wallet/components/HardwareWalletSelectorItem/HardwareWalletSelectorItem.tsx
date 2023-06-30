import React from 'react'
import { Image, ViewStyle } from 'react-native'
import { Pressable } from 'react-native-web-hover'

import Button from '@common/components/Button'
import colors from '@common/styles/colors'
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
    <Pressable
      onPress={() => {
        onSelect()
      }}
    >
      {({ hovered }) => (
        <Card
          text={text}
          style={[
            styles.itemContainer,
            style,
            { borderWidth: 1, borderColor: hovered ? colors.violet : colors.melrose_15 }
          ]}
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
      )}
    </Pressable>
  )
}

export default HardwareWalletSelectorItem
