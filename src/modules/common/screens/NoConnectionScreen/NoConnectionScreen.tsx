import React from 'react'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import textStyles from '@modules/common/styles/utils/text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

interface Props extends NativeStackScreenProps<any, 'no-connection'> {}

const NoConnectionScreen: React.FC<Props> = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Title style={textStyles.center}>{t('No internet connection 📡')}</Title>
      <Text>
        {t(
          'You are not connected to the Internet. Make sure Wi-Fi is on, Airplane Mode is off and try again.'
        )}
      </Text>
    </Wrapper>
  )
}

export default NoConnectionScreen
