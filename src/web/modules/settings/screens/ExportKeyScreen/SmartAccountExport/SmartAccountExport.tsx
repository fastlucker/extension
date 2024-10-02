import React, { FC } from 'react'
import { View } from 'react-native'
import { Link } from 'react-router-dom'

import { Account } from '@ambire-common/interfaces/account'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'

import SettingsPageHeader from '../../../components/SettingsPageHeader'

interface Props {
  account: Account
  privateKey: string
}

const SmartAccountExport: FC<Props> = ({ account, privateKey }) => {
  const { t } = useTranslation()
  const smartAccountJson = {
    addr: account.addr,
    associatedKeys: account.associatedKeys,
    creation: account.creation,
    initialPrivileges: account.initialPrivileges,
    preferences: account.preferences,
    privateKey
  }

  return (
    <>
      <SettingsPageHeader title="Smart account export" />
      <View>
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
        <Button style={[spacings.mtTy]}>
          <Text weight="medium" style={{ color: '#fff' }}>
            Download
          </Text>
        </Button>
      </Link>
    </>
  )
}

export default React.memo(SmartAccountExport)
