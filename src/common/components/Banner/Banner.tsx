import React, { FC, useMemo } from 'react'
import { View, ViewStyle } from 'react-native'

import { BannerType } from '@ambire-common/interfaces/banner'
import ErrorIcon from '@common/assets/svg/ErrorIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import SuccessIcon from '@common/assets/svg/SuccessIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import CommonButton, { Props as CommonButtonProps } from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const ICON_MAP: {
  [key in BannerType]: React.FC<any>
} = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoIcon
}

export interface Props {
  title: string
  type: BannerType
  text?: string
  children?: React.ReactElement | React.ReactElement[]
  renderButtons?: React.ReactNode | React.ReactNode[]
  CustomIcon?: React.FC<any>
  style?: ViewStyle
}

const Button: FC<CommonButtonProps & { isReject?: boolean }> = ({ isReject, style, ...rest }) => {
  const { theme } = useTheme()

  return (
    <CommonButton
      {...rest}
      size="small"
      textUnderline={isReject}
      textStyle={isReject && { color: theme.errorDecorative }}
      style={[
        spacings.mlTy,
        spacings.ph,
        isReject && { borderWidth: 0 },
        { minWidth: 80 },
        (style || {}) as ViewStyle
      ]}
      hasBottomSpacing={false}
      type={isReject ? 'ghost' : 'primary'}
      submitOnEnter={false}
    />
  )
}

const { isTab } = getUiType()

const Banner = ({ type, title, text, children, CustomIcon, renderButtons, style }: Props) => {
  const { styles, theme } = useTheme(getStyles)

  const Icon = useMemo(() => {
    if (CustomIcon) return CustomIcon

    return ICON_MAP[type]
  }, [CustomIcon, type])

  return (
    <View style={[styles.container, { backgroundColor: theme[`${type}Background`] }, style]}>
      <View style={[styles.content, { borderLeftColor: theme[`${type}Decorative`] }]}>
        <View style={[spacings.mrSm, spacings.mtMi]}>
          <Icon width={20} height={20} color={theme[`${type}Decorative`]} />
        </View>

        <View style={[flexbox.wrap, flexbox.flex1]}>
          <Text appearance="primaryText" fontSize={isTab ? 16 : 14} weight="medium">
            {title}
          </Text>
          <Text fontSize={isTab ? 14 : 12} weight="regular" appearance="secondaryText">
            {text}
          </Text>
        </View>
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>{renderButtons}</View>
      {children}
    </View>
  )
}

Banner.Button = Button

export default Banner
