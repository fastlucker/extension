import React from 'react'

import { useTranslation } from '@config/localization'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
import GasTankStateToggle from '@modules/gas-tank/components/GasTankStateToggle'

const GasTankScreen = () => {
  const { t } = useTranslation()
  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <Text style={[textStyles.center, spacings.mbTy]} fontSize={16} weight="medium">
          {t('Reduce fees by enabling the gas tank.')}
        </Text>
        <GasTankStateToggle />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default GasTankScreen
