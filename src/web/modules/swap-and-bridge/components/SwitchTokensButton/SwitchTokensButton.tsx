import React from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Pressable, PressableProps, View } from 'react-native'

import SwapBridgeToggleIcon from '@common/assets/svg/SwapBridgeToggleIcon'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import { useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

const SWITCH_TOKENS_CONDITION_TOOLTIP_ID = 'switch-tokens-condition-tooltip'

const SwitchTokensButton = ({ disabled, ...rest }: PressableProps) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const [bindAnim, , , , animatedValues] = useCustomHover({
    property: 'rotateZ' as any,
    values: { from: 0, to: 1 },
    duration: 250
  })

  const rotateInterpolate = animatedValues
    ? animatedValues[0].value.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
      })
    : null

  return (
    <View
      style={styles.switchTokensButtonWrapper}
      // @ts-ignore `dataSet` exists, but lacks a type
      dataSet={disabled && { tooltipId: SWITCH_TOKENS_CONDITION_TOOLTIP_ID }}
    >
      <Pressable style={styles.switchTokensButton} {...bindAnim} disabled={disabled} {...rest}>
        <Animated.View style={{ transform: [{ rotateZ: rotateInterpolate || '0deg' }] }}>
          <SwapBridgeToggleIcon />
        </Animated.View>
      </Pressable>
      {disabled && (
        <Tooltip
          content={t(
            'Switching tokens is only possible if the account already holds some of the receive token.'
          )}
          id={SWITCH_TOKENS_CONDITION_TOOLTIP_ID}
        />
      )}
    </View>
  )
}

export default React.memo(SwitchTokensButton)
