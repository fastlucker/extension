import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import CheckIcon from '@common/assets/svg/CheckIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { AUTO_LOCK_TIMES } from '@web/extension-services/background/controllers/auto-lock'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import useWalletStateController from '@web/hooks/useWalletStateController'

type Props = {
  period: AUTO_LOCK_TIMES
}

const AutoLockOption: FC<Props> = ({ period }: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const { autoLockPeriod } = useWalletStateController()
  const { addToast } = useToast()
  const isSelected = useMemo(() => autoLockPeriod === period, [autoLockPeriod, period])

  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.secondaryBackground,
      to: theme.tertiaryBackground
    },
    forceHoveredStyle: isSelected
  })

  const getAutoLockLabel = useCallback(() => {
    if (period === AUTO_LOCK_TIMES._7days) return t('7 days')
    if (period === AUTO_LOCK_TIMES._1day) return t('1 day')
    if (period === AUTO_LOCK_TIMES._4hours) return t('4 hours')
    if (period === AUTO_LOCK_TIMES._1hour) return t('1 hour')
    if (period === AUTO_LOCK_TIMES._10minutes) return t('10 minutes')

    return t('Never')
  }, [t, period])

  return (
    <AnimatedPressable
      onPress={() => {
        dispatch({ type: 'SET_AUTO_LOCK_PERIOD', params: period })
        addToast(t(`Auto lock period updated to ${getAutoLockLabel()}.`))
      }}
      disabled={!!isSelected}
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        spacings.phSm,
        spacings.mbSm,
        {
          borderRadius: BORDER_RADIUS_PRIMARY,
          height: 50,
          borderWidth: 1,
          borderColor: theme.secondaryBorder
        },
        animStyle
      ]}
      {...bindAnim}
    >
      <Text fontSize={16} weight="medium" numberOfLines={1} style={[flexbox.flex1, spacings.mrSm]}>
        {getAutoLockLabel()}
      </Text>
      {!!isSelected && <CheckIcon />}
    </AnimatedPressable>
  )
}

export default React.memo(AutoLockOption)
