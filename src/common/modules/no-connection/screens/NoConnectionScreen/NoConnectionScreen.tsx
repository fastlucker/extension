import React from 'react'

import Satellite from '@common/assets/svg/Satellite'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'

const NoConnectionScreen = () => {
  const { t } = useTranslation()

  return (
    <ScrollableWrapper contentContainerStyle={flexboxStyles.center}>
      <Satellite style={spacings.mbLg} />
      <Title style={textStyles.center}>{t('No Internet Connection')}</Title>
      <Text style={[spacings.mb, textStyles.center]}>
        {t(
          'You are not connected to the Internet. Make sure you are connected over Wi-Fi or your phone mobile data is turned on.'
        )}
      </Text>
    </ScrollableWrapper>
  )
}

export default NoConnectionScreen
