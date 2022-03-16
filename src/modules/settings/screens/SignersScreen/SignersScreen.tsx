import React from 'react'

import { useTranslation } from '@config/localization'
import Button, { BUTTON_TYPES } from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import textStyles from '@modules/common/styles/utils/text'

const SignersScreen = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Title>{t('Hardware wallet signers')}</Title>
      <Button text={t('Connect Ledger Nano X')} />
      <Button disabled text={t('Connect Trezor')} />
      <P>{t('To manage signers other than Ledger Nano X or Trezor, visit the web app.')}</P>

      <Title>{t('Connected hardware wallet signers')}</Title>
      <P>
        <Text style={textStyles.bold}>Ledger</Text> 0xfAFd254D25b3B26E322592F961B89207c71b9f85
      </P>
      <Button type={BUTTON_TYPES.DANGER} text={t('Remove')} />
    </Wrapper>
  )
}

export default SignersScreen
