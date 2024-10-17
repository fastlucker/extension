import React, { FC } from 'react'
import { View } from 'react-native'
import { Link } from 'react-router-dom'

import { Account } from '@ambire-common/interfaces/account'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'

interface Props {
  account: Account
  privateKey: string
}

const SmartAccountExport: FC<Props> = ({ account, privateKey }) => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const smartAccountJson = {
    addr: account.addr,
    associatedKeys: account.associatedKeys,
    creation: account.creation,
    initialPrivileges: account.initialPrivileges,
    preferences: account.preferences,
    privateKey
  }

  const returnToAccounts = () => {
    navigate(ROUTES.accountsSettings)
  }

  return (
    <>
      <SettingsPageHeader title="Smart account export" />
      <View style={[spacings.mbTy]}>
        <Alert
          size="sm"
          type="warning"
          title={t(
            'Warning: Below is a download option for a JSON backup of your smart account. Never disclose this file or share it with anyone. The file containts the private key with the privileges to execute transactions on behalf of the smart account. Anyone with it can steal any assets held in your account'
          )}
        />
      </View>
      <Link
        to={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(smartAccountJson))}`}
        download="smartAccount.json"
        style={{ textDecoration: 'none' }}
      >
        <Button style={[spacings.mb0, spacings.mt0]} text="Download" />
      </Link>
      <Button onPress={returnToAccounts} type="secondary" style={[spacings.mtTy]} text="Back" />
    </>
  )
}

export default React.memo(SmartAccountExport)
