import React, { FC } from 'react'
import { View, ViewStyle } from 'react-native'
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
import { getUiType } from '@web/utils/uiType'

import Text, { TextWeight } from '../Text'

interface Props {
  title?: string | React.ReactNode
  titleWeight?: TextWeight
  text?: string
  type?: 'error' | 'warning' | 'success' | 'info'
  style?: ViewStyle
  children?: React.ReactNode
  size?: 'sm' | 'md'
  isTypeLabelHidden?: boolean
  buttonProps?: ButtonProps
  customIcon?: React.FC<SvgProps>
}

const ICON_MAP = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoIcon
}

const { isPopup } = getUiType()

const Alert: FC<Props> = ({
  title,
  titleWeight,
  text,
  type = 'info',
  style,
  children,
  size = 'md',
  isTypeLabelHidden = true,
  buttonProps,
  customIcon: CustomIcon
}) => {
  const Icon = ICON_MAP[type]
  const { theme } = useTheme()
  const isSmall = size === 'sm' || isPopup
  const fontSize = !isSmall ? 16 : 14

  return (
    <View
      style={[
        !isSmall ? spacings.ph : spacings.phSm,
        !isSmall ? spacings.pv : spacings.pvSm,
        flexbox.directionRow,
        common.borderRadiusPrimary,
        {
          borderWidth: 1,
          backgroundColor: theme[`${type}Background`],
          borderColor: theme[`${type}Decorative`]
        },
        style
      ]}
    >
      <View style={[!isSmall && spacings.mr, !!isSmall && spacings.mrTy]}>
        {CustomIcon ? (
          <CustomIcon />
        ) : (
          <Icon width={20} height={20} color={theme[`${type}Decorative`]} />
        )}
      </View>

      <View style={flexbox.flex1}>
        {!!title && (
          <Text style={text ? spacings.mbTy : {}}>
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
        {!!text && (
          <Text selectable fontSize={fontSize - 2} weight="regular" appearance={`${type}Text`}>
            {text}
          </Text>
        )}
        {buttonProps && (
          <Button
            style={{
              alignSelf: 'flex-end',
              ...spacings.mtTy
            }}
            textStyle={{ fontSize: 12 }}
            size="small"
            type="primary"
            hasBottomSpacing={false}
            text={buttonProps.text}
            onPress={buttonProps.onPress}
          />
        )}
        {children}
      </View>
    </View>
  )
}

export default Alert
