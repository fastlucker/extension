import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Account } from '@ambire-common/interfaces/account'
import {
  isAmbireV1LinkedAccount as getIsAmbireV1LinkedAccount,
  isSmartAccount as getIsSmartAccount
} from '@ambire-common/libs/account/account'
import Badge from '@common/components/Badge'
import spacings from '@common/styles/spacings'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

interface Props {
  accountData: Account
}

const AccountBadges: FC<Props> = ({ accountData }) => {
  const { t } = useTranslation()
  const keystoreCtrl = useKeystoreControllerState()

  const isSmartAccount = useMemo(
    () => getIsSmartAccount(accountData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountData?.addr]
  )

  const isAmbireV1LinkedAccount = useMemo(() => {
    return getIsAmbireV1LinkedAccount(accountData?.creation?.factoryAddr)
  }, [accountData?.creation?.factoryAddr])

  return (
    <>
      <Badge
        withIcon
        style={spacings.mlTy}
        type={isSmartAccount ? 'success' : 'warning'}
        text={isSmartAccount ? t('Smart Account') : t('Basic Account')}
      />
      {keystoreCtrl.keys.every((k) => !accountData?.associatedKeys.includes(k.addr)) && (
        <Badge style={spacings.mlTy} type="info" text={t('View-only')} />
      )}
      {isSmartAccount && isAmbireV1LinkedAccount && (
        <Badge style={spacings.mlTy} type="info" text={t('Ambire v1')} />
      )}
    </>
  )
}

export default AccountBadges
