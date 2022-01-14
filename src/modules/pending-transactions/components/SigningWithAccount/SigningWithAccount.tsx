import React from 'react'
import { useTranslation } from 'react-i18next'
import {} from 'react-native'

import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'

const SigningWithAccount = () => {
  const { t } = useTranslation()
  const { account } = useAccounts()
  const { network } = useNetwork()
  return (
    <Panel>
      <Title>{t('Signing with account')}</Title>
      <Text>
        {account.id}
        {!!account.id && <Text>{' on '}</Text>}
        <Text>{network?.name}</Text>
      </Text>
    </Panel>
  )
}

export default SigningWithAccount
