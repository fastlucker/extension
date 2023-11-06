import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, ImageProps, ImageStyle, Pressable, ViewProps } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

interface Props {
  style?: ViewProps['style']
  text?: string | React.ReactNode
  title?: string
  icon?: any
  image?: {
    source: ImageProps['source']
    style: ImageStyle
  }
  onPress?: () => void
  buttonText?: string
  testId?: string
}

const Card: React.FC<Props> = ({ style, text, title, icon: Icon, image, onPress, buttonText }) => {
  const { t } = useTranslation()

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered }: any) => [
        styles.container,
        { borderWidth: 1, borderColor: hovered ? colors.violet : colors.melrose_15 },
        style
      ]}
    >
      {({ hovered }: any) => (
        <>
          {Icon && <Icon color={hovered ? colors.violet : colors.melrose} />}
          {image && <Image source={image.source} style={image.style} resizeMode="contain" />}
          {title && (
            <Text weight="medium" style={[spacings.mb, textStyles.center]} fontSize={16}>
              {t(title)}
            </Text>
          )}
          {text && (
            <Text style={[spacings.mb, flexbox.flex1]} fontSize={12}>
              <Trans>{text}</Trans>
            </Text>
          )}
          {buttonText && (
            <Button
              testID='button'
              textStyle={{ fontSize: 14 }}
              containerStyle={{ width: '100%' }}
              text={t(buttonText)}
              onPress={onPress}
              hasBottomSpacing={false}
            />
          )}
        </>
      )}
    </Pressable>
  )
}

export default Card
