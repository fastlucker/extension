import React, { FunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
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
}: Props) => {
  const { t } = useTranslation()

  return (
    <Card
      style={style}
      textStyle={[textStyles.center, spacings.mt2Xl]}
      text={
        <View>
          <Text fontSize={14} appearance="primaryText">
            {t('Supported')}:
          </Text>
          <View>
            {models.map((model, index) => (
              <Text key={model} fontSize={14} appearance="primaryText" weight="semiBold">
                {model}
                {index !== models.length - 1 ? ',' : ''}
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
}

export default HardwareWalletSelectorItem
