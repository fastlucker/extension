import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, ViewProps } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

interface Props {
  style?: ViewProps['style']
  text?: string
  title?: string
  icon?: any
  image?: React.ReactNode
  onPress?: () => void
  buttonText?: string
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
          {image && image}
          {title && (
            <Text weight="medium" style={[spacings.mb, textStyles.center]} fontSize={16}>
              {title}
            </Text>
          )}
          {text && (
            <Text style={[spacings.mb, flexbox.flex1]} fontSize={12}>
              {text}
            </Text>
          )}
          {buttonText && (
            <Button
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
