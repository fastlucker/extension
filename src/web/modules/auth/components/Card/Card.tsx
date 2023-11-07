import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, TextStyle, View, ViewStyle } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import styles from './styles'

interface Props {
  style?: ViewStyle | ViewStyle[]
  text?: string | React.ReactNode
  textStyle?: TextStyle | TextStyle[]
  title?: string
  icon?: any
  onPress?: () => void
  buttonText?: string
  isDisabled?: boolean
}

const Card: React.FC<Props> = ({
  style,
  text,
  title,
  textStyle,
  icon: Icon,
  onPress,
  isDisabled,
  buttonText
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <Pressable
      onPress={!isDisabled ? onPress : () => {}}
      style={({ hovered }: any) => [
        styles.container,
        !isDisabled && { borderWidth: 1, borderColor: hovered ? theme.primary : 'transparent' },
        isDisabled && { opacity: 0.7 },
        style
      ]}
    >
      {!!Icon && (
        <View style={styles.iconWrapper}>
          <Icon color={iconColors.primary} />
        </View>
      )}
      {!!title && (
        <Text weight="medium" style={[spacings.mb, textStyles.center]} fontSize={18}>
          {t(title)}
        </Text>
      )}
      {!!text && (
        <Text
          style={[spacings.mb, flexbox.flex1, textStyle]}
          fontSize={14}
          appearance="secondaryText"
        >
          <Trans>{text}</Trans>
        </Text>
      )}
      {!!buttonText && (
        <Button
          disabled={isDisabled}
          textStyle={{ fontSize: 14 }}
          style={{ width: '100%' }}
          text={t(buttonText)}
          onPress={!isDisabled ? onPress : () => {}}
          hasBottomSpacing={false}
        />
      )}
    </Pressable>
  )
}

export default Card
