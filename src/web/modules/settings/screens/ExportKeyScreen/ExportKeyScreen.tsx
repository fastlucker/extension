import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { isSmartAccount } from '@ambire-common/libs/account/account'
import Alert from '@common/components/Alert'
import { useTranslation } from '@common/config/localization'
import useAccounts from '@common/hooks/useAccounts'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import PasswordConfirmation from '../../components/PasswordConfirmation'
import PrivateKeyExport from './PrivateKeyExport'
import SmartAccountExport from './SmartAccountExport'

const ExportKeyScreen = () => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const keystoreState = useKeystoreControllerState()

  const { accounts } = useAccounts()
  const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false)
  const [privateKey, setPrivateKey] = useState<string | null>(null)

  const { search } = useRoute()
  const params = new URLSearchParams(search)

  const accountAddr = params.get('accountAddr')
  const account = useMemo(
    () => accounts.find((acc) => acc.addr === accountAddr),
    [accounts, accountAddr]
  )
  const isSA = isSmartAccount(account)

  const keyAddr = params.get('keyAddr')
  const key = useMemo(
    () => keystoreState.keys.find((aKey) => aKey.addr === keyAddr),
    [keystoreState.keys, keyAddr]
  )

  useEffect(() => {
    const onReceiveOnTimeData = (data: any) => {
      if (!data.privateKey) return

      setPrivateKey(data.privateKey)
    }

    eventBus.addEventListener('receiveOneTimeData', onReceiveOnTimeData)

    return () => eventBus.removeEventListener('addToast', onReceiveOnTimeData)
  }, [])

  const onPasswordConfirmed = () => {
    if (!keyAddr) return // shouldn't happen

    setPasswordConfirmed(true)
    dispatch({
      type: 'KEYSTORE_CONTROLLER_SEND_PRIVATE_KEY_OVER_CHANNEL',
      params: { keyAddr }
    })
  }

  if (!account || !key) {
    return (
      <Alert
        type="warning"
        style={spacings.mtTy}
        text={t('Something went wrong as the account/key was not found. Please contract support')}
      />
    )
  }

  return (
    <View style={{ maxWidth: 440 }}>
      {!passwordConfirmed && <PasswordConfirmation onPasswordConfirmed={onPasswordConfirmed} />}
      {passwordConfirmed && privateKey && !isSA && <PrivateKeyExport privateKey={privateKey} />}
      {passwordConfirmed && privateKey && isSA && (
        <SmartAccountExport account={account} privateKey={privateKey} />
      )}
    </View>
  )
}

export default React.memo(ExportKeyScreen)
