import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import CreateWalletIcon from '@common/assets/svg/CreateWalletIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import ViewModeIcon from '@common/assets/svg/ViewModeIcon'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

const AddAccount = () => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { navigate } = useNavigation()

  type Option = {
    text: string
    icon: React.FC<any>
    onPress: () => void
    hasLargerBottomSpace?: boolean
  }

  const options: Option[] = useMemo(
    () => [
      {
        text: t('Connect a Hardware Wallet'),
        icon: HWIcon,
        onPress: () => navigate(ROUTES.hardwareWalletSelect)
      },
      {
        text: t('Import an existing hot wallet'),
        icon: ImportAccountIcon,
        onPress: () => navigate(ROUTES.importHotWallet)
      },
      {
        text: t('Create a new hot wallet'),
        icon: CreateWalletIcon,
        onPress: () => navigate(ROUTES.createHotWallet),
        hasLargerBottomSpace: true
      },
      {
        text: t('Watch an address'),
        icon: ViewModeIcon,
        onPress: () => navigate(ROUTES.viewOnlyAccountAdder)
      }
    ],
    [navigate, t]
  )

  const addAccountOption = useCallback(
    (option: Option) => {
      const Icon = option.icon
      const [bindAnim, animStyle, isHovered] = useCustomHover({
        property: 'borderColor',
        values: {
          from: theme.primaryBackground,
          to: theme.primary
        }
      })

      return (
        <AnimatedPressable
          testID={option.text.toLowerCase().replace(/\s+/g, '-')}
          key={option.text}
          style={[
            styles.addAccountOptionContainer,
            option.hasLargerBottomSpace && spacings.mbXl,
            animStyle
          ]}
          onPress={option.onPress}
          {...bindAnim}
        >
          <View style={styles.optionIconWrapper}>
            <Icon color={isHovered ? theme.primary : iconColors.primary} />
          </View>
          <Text style={flexbox.flex1} fontSize={14} weight="medium" numberOfLines={1}>
            {option.text}
          </Text>
          <View style={spacings.mrSm}>
            <RightArrowIcon />
          </View>
        </AnimatedPressable>
      )
    },
    [styles, theme]
  )

  return (
    <View style={spacings.ptSm}>
      <Text fontSize={16} weight="medium" style={spacings.mbLg}>
        {t('Select one of the following options')}
      </Text>
      {options.map((option) => {
        return addAccountOption(option)
      })}
    </View>
  )
}

export default React.memo(AddAccount)
