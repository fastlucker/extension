import React from 'react'

import { useTranslation } from '@config/localization'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import textStyles from '@modules/common/styles/utils/text'
import { useNavigation } from '@react-navigation/native'

const SignersScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const goToConnectLedger = () => navigation.navigate('connect-ledger')

  return (
    <Wrapper>
      <Title>{t('Hardware wallet signers')}</Title>
      <Button text={t('Connect Ledger Nano X')} onPress={goToConnectLedger} />
      <Button disabled text={t('Connect Trezor')} />
      <P>{t('To manage signers other than Ledger Nano X or Trezor, visit the web app.')}</P>

      <Title>{t('Connected hardware wallet signers')}</Title>
      <P>
        <Text style={textStyles.bold}>Ledger</Text> 0xB66767DE2A2FFC520BF0e3B59321Faa0fb0090d7
      </P>
      <Button type={BUTTON_TYPES.DANGER} text={t('Remove')} />
    </Wrapper>
  )
}

export default SignersScreen
