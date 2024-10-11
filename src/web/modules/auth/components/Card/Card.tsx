import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TextStyle, View, ViewStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

interface Props {
  style?: ViewStyle | ViewStyle[]
  titleStyle?: TextStyle[]
  text?: string | React.ReactNode
  textStyle?: TextStyle | TextStyle[]
  title?: string
  icon?: any
  onPress?: () => void
  buttonText?: string
  isDisabled?: boolean
  isPartiallyDisabled?: boolean
  isSecondary?: boolean
  iconProps?: SvgProps
  testID?: string
  children?: React.ReactNode | React.ReactNode[]
}

const Card: React.FC<Props> = ({
  testID,
  style,
  titleStyle = [],
  text,
  title,
  textStyle,
  icon: Icon,
  onPress,
  isDisabled,
  isPartiallyDisabled,
  buttonText,
  isSecondary = false,
  iconProps = {},
  children
}) => {
  const { theme, styles } = useTheme(getStyles)
  const [bindAnim, animStyle, isHovered, triggerHovered] = useCustomHover({
    property: 'borderColor',
    values: {
      from: isSecondary ? theme.secondaryBorder : theme.primaryBackground,
      to: theme.primary
    }
  })
  const { t } = useTranslation()
  const hoveredIconColor = isSecondary ? theme.primary : theme.primaryText

  return (
    <AnimatedPressable
      onPress={!isDisabled ? onPress : () => {}}
      style={[
        styles.container,
        isSecondary && styles.secondaryContainer,
        !isDisabled && {
          borderWidth: 1
        },
        animStyle,
        isDisabled && { opacity: 0.7 },
        isDisabled &&
          isWeb && {
            // @ts-ignore cursor only works on web
            cursor: 'not-allowed'
          },
        style
      ]}
      {...bindAnim}
    >
      <View style={[flexbox.flex1, isPartiallyDisabled && { opacity: 0.7 }]}>
        {!!Icon && (
          <View style={styles.iconWrapper}>
            <Icon color={isHovered ? hoveredIconColor : theme.secondaryText} {...iconProps} />
          </View>
        )}
        {!!title && (
          <Text
            weight="medium"
            style={[spacings.mb, textStyles.center, ...titleStyle]}
            fontSize={20}
          >
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
      </View>
      {children}
      {!!buttonText && (
        <Button
          testID={testID}
          disabled={isDisabled}
          style={{ width: '100%' }}
          text={t(buttonText)}
          type={isSecondary ? 'secondary' : 'primary'}
          onPress={!isDisabled ? onPress : () => {}}
          onHoverIn={() => !isDisabled && triggerHovered()}
          hasBottomSpacing={false}
          forceHoveredStyle={isHovered}
          submitOnEnter={false}
        />
      )}
    </AnimatedPressable>
  )
}

export default Card
