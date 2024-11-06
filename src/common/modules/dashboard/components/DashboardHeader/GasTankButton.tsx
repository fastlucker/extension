import { useEffect, useRef } from 'react'
import { View } from 'react-native'

import GasTankIcon from '@common/assets/svg/GasTankIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import { NEUTRAL_BACKGROUND_HOVERED } from '../../screens/styles'

type Props = {
  onPress: () => void
  onPosition: (position: { x: number; y: number; width: number; height: number }) => void
}

const GasTankButton = ({ onPress, onPosition }: Props) => {
  const { t } = useTranslation()
  const buttonRef = useRef(null)

  const [bindGasTankBtnAim, removeTankBtnStyle] = useCustomHover({
    property: 'backgroundColor',
    values: { from: NEUTRAL_BACKGROUND_HOVERED, to: '#14183380' } // TODO: Remove hardcoded hex
  })

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        onPosition({ x: px, y: py, width, height })
      })
    }
  }, [onPosition])

  return (
    <View>
      <AnimatedPressable
        ref={buttonRef}
        onPress={onPress}
        style={{
          ...flexbox.directionRow,
          ...flexbox.center,
          ...spacings.phTy,
          ...common.borderRadiusPrimary,
          ...common.shadowPrimary,
          ...removeTankBtnStyle
        }}
        {...bindGasTankBtnAim}
      >
        <GasTankIcon width={20} color="white" />
        <Text style={[spacings.mlTy]} color="white" weight="number_bold" fontSize={12}>
          $25.23
        </Text>
        <Text style={[spacings.mlTy, { opacity: 0.57 }]} fontSize={12} color="white">
          {t('on Gas Tank')}
        </Text>
      </AnimatedPressable>
    </View>
  )
}

export default GasTankButton
