import React from 'react'
import { TextProps, View, ViewStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'

import ErrorIcon from '@common/assets/svg/ErrorIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import SuccessIcon from '@common/assets/svg/SuccessIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Button, { Props as ButtonProps } from '@common/components/Button'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import CopyIcon from '@web/assets/svg/CopyIcon'
import { getUiType } from '@web/utils/uiType'

import Text, { TextWeight } from '../Text'

interface Props {
  title?: string | React.ReactNode
  titleWeight?: TextWeight
  text?: string | React.ReactNode
  type?: 'error' | 'warning' | 'success' | 'info' | 'info2'
  style?: ViewStyle
  children?: React.ReactNode
  size?: 'sm' | 'md'
  isTypeLabelHidden?: boolean
  buttonProps?: ButtonProps
  customIcon?: React.FC<SvgProps>
  withIcon?: boolean
  testID?: string
}

const ICON_MAP = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoIcon,
  info2: InfoIcon
}

const { isPopup } = getUiType()

const DEFAULT_SM_FONT_SIZE = 14
const DEFAULT_MD_FONT_SIZE = 16

interface AlertVerticalTextProps extends TextProps {
  children: React.ReactNode
  size?: Props['size']
  type?: Props['type']
}

const AlertVerticalText: React.FC<AlertVerticalTextProps> = ({
  children,
  size = 'md',
  type = 'info',
  style,
  ...rest
}) => {
  const isSmall = size === 'sm' || isPopup
  const fontSize = !isSmall ? DEFAULT_MD_FONT_SIZE : DEFAULT_SM_FONT_SIZE

  return (
    <Text
      selectable
      fontSize={fontSize - 2}
      weight="regular"
      style={[spacings.mrTy, { textAlign: 'center' }, style]}
      appearance={`${type}Text`}
      {...rest}
    >
      {children}
    </Text>
  )
}

const AlertVertical = ({
  title,
  titleWeight,
  text,
  type = 'info',
  style,
  children,
  size = 'md',
  isTypeLabelHidden = true,
  buttonProps,
  customIcon: CustomIcon,
  withIcon = true,
  testID
}: Props) => {
  const Icon = ICON_MAP[type]
  const { theme } = useTheme()
  const isSmall = size === 'sm' || isPopup
  const fontSize = !isSmall ? DEFAULT_MD_FONT_SIZE : DEFAULT_SM_FONT_SIZE

  return (
    <View
      style={[
        !isSmall ? spacings.phLg : spacings.ph,
        !isSmall ? spacings.pvLg : spacings.pv,
        common.borderRadiusPrimary,
        flexbox.alignCenter,
        {
          borderWidth: 1,
          backgroundColor: theme[`${type}Background`],
          borderColor: theme[`${type}Decorative`]
        },
        style
      ]}
      testID={testID}
    >
      {!!withIcon && (
        <View style={[!isSmall ? spacings.mbLg : spacings.mbTy]}>
          {CustomIcon ? (
            <CustomIcon />
          ) : (
            <Icon width={48} height={48} color={theme[`${type}Decorative`]} />
          )}
        </View>
      )}
      {!!title && (
        <Text
          style={[
            text ? (!isSmall ? spacings.mbSm : spacings.mbTy) : {},
            {
              textAlign: 'center'
            }
          ]}
        >
          {!isTypeLabelHidden && (
            <Text
              selectable
              appearance={`${type}Text`}
              fontSize={fontSize}
              weight={titleWeight || 'semiBold'}
              style={{ textTransform: 'capitalize' }}
            >
              {type}:{' '}
            </Text>
          )}
          <Text
            selectable
            appearance={`${type}Text`}
            fontSize={fontSize}
            weight={titleWeight || 'semiBold'}
          >
            {title}
          </Text>
        </Text>
      )}
      <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifyCenter]}>
        {!!text &&
          (typeof text === 'string' ? (
            <AlertVerticalText size={size} type={type}>
              {text}{' '}
            </AlertVerticalText>
          ) : (
            text
          ))}
        <CopyIcon
          strokeWidth={1.5}
          style={spacings.mlMi}
          width={20}
          height={20}
          color={theme[`${type}Text`]}
        />
      </View>
      {buttonProps && (
        <Button
          style={{
            alignSelf: 'flex-end',
            ...spacings.mtTy
          }}
          textStyle={type === 'error' && { fontSize: 14 }}
          size="small"
          type="primary"
          hasBottomSpacing={false}
          text={buttonProps.text}
          onPress={buttonProps.onPress}
          {...buttonProps}
        />
      )}
      {children}
    </View>
  )
}

AlertVertical.Text = AlertVerticalText

export default AlertVertical
