import { SignMessageController } from 'ambire-common/src/controllers/signMessage/signMessage'
import { Account } from 'ambire-common/src/interfaces/account'
import { Key } from 'ambire-common/src/interfaces/keystore'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Select from '@common/components/Select'
import spacings from '@common/styles/spacings'

type Props = {
  keystoreKeys: Key[]
  selectedKeyAddr: SignMessageController['signingKeyAddr']
  selectedKeyType: SignMessageController['signingKeyType']
  selectedAccountFull: Account
  handleChangeSigningKey: (keyAddr: Key['addr'], keyType: Key['type']) => void
}

const SigningKeySelect = ({
  keystoreKeys,
  selectedKeyAddr,
  selectedKeyType,
  selectedAccountFull,
  handleChangeSigningKey
}: Props) => {
  const { t } = useTranslation()

  // Pull keys from the Keystore and match the ones that have the
  // same address as the associatedKeys for the selected account.
  const keySelectorValues = useMemo(
    () =>
      keystoreKeys
        .filter((key) => selectedAccountFull.associatedKeys.includes(key.addr))
        .map((key) => ({
          value: `${key.addr}|${key.type}`,
          label: `${key.label} (${key.addr})`
        })),
    [keystoreKeys, selectedAccountFull.associatedKeys]
  )

  const keyValue = React.useMemo(() => {
    const key = keystoreKeys.find((x) => x.addr === selectedKeyAddr && x.type === selectedKeyType)

    return {
      value: `${selectedKeyAddr}|${selectedKeyType}`,
      label: key ? `${key.label} (${key.addr})` : 'Key'
    }
  }, [keystoreKeys, selectedKeyAddr, selectedKeyType])

  return (
    <Select
      setValue={(newValue: any) => {
        const [keyAddr, keyType] = newValue.value.split('|')
        handleChangeSigningKey(keyAddr, keyType)
      }}
      label={
        selectedAccountFull.label
          ? t('Signing with account {{accountLabel}} ({{accountAddress}}) via key:', {
              accountLabel: selectedAccountFull.label,
              accountAddress: selectedAccountFull.addr
            })
          : t('Signing with account {{accountAddress}} via key:', {
              accountAddress: selectedAccountFull.addr
            })
      }
      options={keySelectorValues}
      disabled={!keySelectorValues.length}
      style={spacings.mb}
      value={keyValue}
      defaultValue={keyValue}
    />
  )
}

export default SigningKeySelect
