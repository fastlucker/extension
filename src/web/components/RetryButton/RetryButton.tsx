import RetryIcon from '@common/assets/svg/RetryIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  onPress: () => {}
  type?: 'default' | 'wide'
}

const RetryButton: FC<Props> = ({ onPress, type = 'default' }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: `${theme.primary as string}14`,
      to: theme.primary20
    }
  })

  const defaultSpacings = {
    ...spacings.pvSm,
    ...spacings.ph,
    ...spacings.mt
  }

  const wideSpacings = {
    ...spacings.pvTy,
    ...spacings.phXl
  }

  const usedSpacings = type === 'default' ? defaultSpacings : wideSpacings

  return (
    <AnimatedPressable
      style={{
        borderRadius: 50,
        ...flexbox.directionRow,
        ...flexbox.alignCenter,
        ...animStyle,
        ...usedSpacings
      }}
      onPress={onPress}
      {...bindAnim}
    >
      <Text fontSize={12} weight="medium" color={theme.primary} style={spacings.mrTy}>
        {t('Retry')}
      </Text>
      <RetryIcon color={theme.primary} />
    </AnimatedPressable>
  )
}

export default RetryButton
