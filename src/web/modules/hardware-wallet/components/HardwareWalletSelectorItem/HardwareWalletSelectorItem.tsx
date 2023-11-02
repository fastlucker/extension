import React from 'react'
import { ViewStyle } from 'react-native'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import textStyles from '@common/styles/utils/text'
import Card from '@web/modules/auth/components/Card'

type Props = {
  title: string
  text: string
  image?: any
  onPress: () => void
  style?: ViewStyle | ViewStyle[]
}

const HardwareWalletSelectorItem = ({ title, text, image, style, onPress }: Props) => {
  return (
    <Card
      style={style}
      textStyle={[textStyles.center, spacings.mt2Xl]}
      text={
        <Text>
          <Text fontSize={14} appearance="secondaryText" weight="semiBold">
            {'Supported: '}
          </Text>
          <Text fontSize={14} appearance="secondaryText">
            {text}
          </Text>
        </Text>
      }
      icon={image}
      onPress={onPress}
      buttonText={title}
    />
  )
}

export default HardwareWalletSelectorItem
