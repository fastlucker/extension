import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable, TextStyle, View, ViewStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

import getStyles from './styles'

interface Props {
  style?: ViewStyle | ViewStyle[]
  text?: string | React.ReactNode
  textStyle?: TextStyle | TextStyle[]
  title?: string
  icon?: any
  onPress?: () => void
  buttonText?: string
  isDisabled?: boolean
  isSecondary?: boolean
  iconProps?: SvgProps
}

const Card: React.FC<Props> = ({
  style,
  text,
  title,
  textStyle,
  icon: Icon,
  onPress,
  isDisabled,
  buttonText,
  isSecondary = false,
  iconProps = {}
}) => {
  const { theme, styles } = useTheme(getStyles)
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useTranslation()
  const hoveredIconColor = isSecondary ? theme.primary : theme.primaryText

  return (
    <Pressable
      onPress={!isDisabled ? onPress : () => {}}
      style={[
        styles.container,
        isSecondary && styles.secondaryContainer,
        !isDisabled && {
          borderWidth: 1,
          borderColor: isHovered
            ? theme.primary
            : isSecondary
            ? theme.secondaryBorder
            : 'transparent'
        },
        isDisabled && { opacity: 0.7 },
        isDisabled &&
          isWeb && {
            // @ts-ignore cursor only works on web
            cursor: 'not-allowed'
          },
        style
      ]}
      onHoverIn={() => !isDisabled && setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      {!!Icon && (
        <View style={styles.iconWrapper}>
          <Icon color={isHovered ? hoveredIconColor : theme.secondaryText} {...iconProps} />
        </View>
      )}
      {!!title && (
        <Text weight="medium" style={[spacings.mb, textStyles.center]} fontSize={20}>
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
          testID={buttonText}
          disabled={isDisabled}
          style={{ width: '100%' }}
          text={t(buttonText)}
          type={isSecondary ? 'secondary' : 'primary'}
          onPress={!isDisabled ? onPress : () => {}}
          onHoverIn={() => !isDisabled && setIsHovered(true)}
          hasBottomSpacing={false}
          forceHoveredStyle={isHovered}
        />
      )}
    </Pressable>
  )
}

export default Card
