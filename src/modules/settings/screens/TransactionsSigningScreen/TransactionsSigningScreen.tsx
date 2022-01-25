import React from 'react'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { PASSCODE_STATES } from '@modules/common/contexts/passcodeContext'
import usePasscode from '@modules/common/hooks/usePasscode'
import useToast from '@modules/common/hooks/useToast'
import { useNavigation } from '@react-navigation/native'

const TransactionsSigningScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { addToast } = useToast()
  const { state, addLocalAuth, hasLocalAuth, removeLocalAuth } = usePasscode()

  const handleEnable = async () => {}

  const handleDisable = async () => {}

  const renderContent = () => {
    if (state === PASSCODE_STATES.NO_PASSCODE) {
      return (
        <>
          <P>{t('First you need to have passcode configured.')}</P>
          <Button
            text={t('Create passcode')}
            onPress={() => navigation.navigate('passcode-create')}
          />
        </>
      )
    }
    if (state.includes([PASSCODE_STATES.PASSCODE_ONLY, PASSCODE_STATES.PASSCODE_AND_LOCAL_AUTH])) {
      return <P>{t('TODO.')}</P>
    }
  }

  return (
    <Wrapper>
      <Title>{t('Use passcode instead of password')}</Title>
      {renderContent()}
    </Wrapper>
  )
}

export default TransactionsSigningScreen
