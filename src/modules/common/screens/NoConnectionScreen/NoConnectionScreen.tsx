import React from 'react'

import Satellite from '@assets/svg/Satellite'
import { useTranslation } from '@config/localization'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

interface Props extends NativeStackScreenProps<any, 'no-connection'> {}

const NoConnectionScreen: React.FC<Props> = () => {
  const { t } = useTranslation()

  return (
    <GradientBackgroundWrapper>
      <Wrapper contentContainerStyle={flexboxStyles.center}>
        <Satellite style={spacings.mbLg} />
        <Title style={textStyles.center}>{t('No Internet Connection')}</Title>
        <Text style={[spacings.mb, textStyles.center]}>
          {t(
            'You are not connected to the Internet. Make sure you are connected over Wi-Fi or your phone mobile data is turned on.'
          )}
        </Text>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default NoConnectionScreen
