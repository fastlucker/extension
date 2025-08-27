import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import RetryIcon from '@common/assets/svg/RetryIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

type Props = {
  onPress: () => {}
}

const RetryButton: FC<Props> = ({ onPress }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: `${theme.primary as string}14`,
      to: theme.primary20
    }
  })

  return (
    <AnimatedPressable
      style={{
        borderRadius: 14,
        ...flexbox.directionRow,
        ...flexbox.alignCenter,
        ...animStyle,
        ...spacings.phTy,
        minHeight: 28,
        paddingLeft: 10
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
