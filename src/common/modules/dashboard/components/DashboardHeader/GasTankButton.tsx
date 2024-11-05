import { View } from 'react-native'

import GasTankIcon from '@common/assets/svg/GasTankIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { AnimatedPressable } from '@web/hooks/useHover'

import { NEUTRAL_BACKGROUND_HOVERED } from '../../screens/styles'

type Props = {
  onPress: () => void
}

const GasTankButton = ({ onPress }: Props) => {
  const { t } = useTranslation()

  return (
    <View>
      <AnimatedPressable onPress={onPress}>
        <View
          style={{
            ...flexbox.directionRow,
            ...flexbox.center,
            ...spacings.phTy,
            ...common.borderRadiusPrimary,
            ...common.shadowPrimary,
            backgroundColor: NEUTRAL_BACKGROUND_HOVERED
          }}
        >
          <GasTankIcon width={16} color="white" />
          <Text style={[spacings.mlTy]} color="white" weight="number_bold" fontSize={12}>
            $25.23
          </Text>
          <Text style={[spacings.mlTy, { opacity: 0.57 }]} fontSize={12} color="white">
            {t('on Gas Tank')}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  )
}

export default GasTankButton
