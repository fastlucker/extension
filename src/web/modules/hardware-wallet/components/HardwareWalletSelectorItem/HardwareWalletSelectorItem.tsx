import React, { FunctionComponent } from 'react'
import { View, ViewStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import textStyles from '@common/styles/utils/text'
import Card from '@web/modules/auth/components/Card'

type Props = {
  title: string
  models: string[]
  image?: FunctionComponent<SvgProps>
  onPress: () => void
  style?: ViewStyle | ViewStyle[]
  isDisabled?: boolean
}

const HardwareWalletSelectorItem = ({
  title,
  models,
  image,
  style,
  onPress,
  isDisabled = false
}: Props) => (
  <Card
    testID={`select-hw-option-${title.toLowerCase()}`}
    style={style}
    textStyle={[textStyles.center, spacings.mt2Xl]}
    title={title}
    text={
      <View>
        <View>
          {models.map((model) => (
            <Text key={model} fontSize={14} appearance="primaryText" weight="semiBold">
              {model}
            </Text>
          ))}
        </View>
      </View>
    }
    icon={image}
    iconProps={{
      height: 80
    }}
    onPress={onPress}
    isDisabled={isDisabled}
    buttonText={title}
  />
)

export default HardwareWalletSelectorItem
