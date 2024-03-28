import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import { KeyPreferences } from '@ambire-common/interfaces/settings'
import AccountKey from '@common/components/AccountKey'
import Alert from '@common/components/Alert'
import BottomSheet from '@common/components/BottomSheet'
import Label from '@common/components/Label'
import Option from '@common/components/Option'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { DEFAULT_KEY_LABEL_PATTERN } from '@web/modules/account-personalize/libs/defaults'

import { getAddKeyOptions } from './helpers/getAddKeyOptions'

interface Props {
  sheetRef: any
  associatedKeys: string[]
  keyPreferences: KeyPreferences
  importedAccountKeys: Key[]
  closeBottomSheet: () => void
  isSmartAccount: boolean
}

type AccountKeyType = {
  isImported: boolean
  addr: Key['addr']
  type?: Key['type']
  meta?: Key['meta']
  label?: string
}

const AccountKeysBottomSheet: FC<Props> = ({
  sheetRef,
  associatedKeys,
  keyPreferences,
  importedAccountKeys,
  closeBottomSheet,
  isSmartAccount
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  const notImportedAccountKeys = associatedKeys.filter(
    (keyAddr) =>
      !importedAccountKeys.some(({ addr }) => addr.toLowerCase() === keyAddr.toLowerCase())
  )

  const accountKeys: AccountKeyType[] = [
    ...importedAccountKeys
      .map((key) => ({
        isImported: true,
        addr: key.addr,
        type: key.type,
        label: keyPreferences.find((x) => x.addr === key.addr && x.type === key.type)?.label,
        meta: key.meta
      }))
      .sort((a, b) => {
        const matchA = a.label?.match(DEFAULT_KEY_LABEL_PATTERN)
        const matchB = b.label?.match(DEFAULT_KEY_LABEL_PATTERN)

        if (matchA && matchB) return +matchA[1] - +matchB[1]
        if (matchA) return -1
        if (matchB) return 1

        // fallback to alphabetical comparison
        return (a.label || '').localeCompare(b.label || '')
      }),
    ...notImportedAccountKeys.map((keyAddr) => ({
      isImported: false,
      addr: keyAddr
    }))
  ]

  // Since Basic accounts have only 1 key, if the internal key is imported,
  // we should not show the option to import another key with a private key or
  // seed phrase, since it is irrelevant for this case.
  const isBasicAccWithImportedOneInternalKey =
    !isSmartAccount &&
    importedAccountKeys.length >= 1 &&
    importedAccountKeys.some((key) => key.type === 'internal')

  const addAccountOptions = getAddKeyOptions({
    navigate,
    t
  }).filter((o) => {
    return !(
      isBasicAccWithImportedOneInternalKey &&
      (o.key === 'private-key' || o.key === 'seed-phrase')
    )
  })

  return (
    <BottomSheet id="account-keys" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
      <Text fontSize={18} weight="medium" style={spacings.mbSm}>
        {t('Account keys')}
      </Text>
      <View
        style={[
          {
            backgroundColor: theme.primaryBackground,
            borderRadius: BORDER_RADIUS_PRIMARY,
            overflow: 'hidden',
            ...spacings.mbMd
          }
        ]}
      >
        {accountKeys.map(({ type, addr, label, isImported, meta }, index) => {
          return (
            <AccountKey
              key={addr + type}
              label={label}
              address={addr}
              type={type}
              isLast={index === accountKeys.length - 1}
              isImported={isImported}
              meta={meta}
            />
          )
        })}
      </View>
      <Text fontSize={18} weight="medium" style={spacings.mbMi}>
        {isSmartAccount ? t('Add more keys') : t('Add key from more sources')}
      </Text>
      <Label
        isTypeLabelHidden
        size="sm"
        text={
          isSmartAccount
            ? t(
                'Re-import this account to add more keys or to use the same key from multiple sources. A key with the same address could originate from either a private key, seed or a hardware wallet.'
              )
            : t(
                'Basic accounts have one key, sourced from a private key, seed, or a hardware wallet. Re-import the account from a different source to use its key from multiple sources.'
              )
        }
        style={spacings.mbSm}
        customTextStyle={{ textTransform: 'none' }}
        type="info"
      />
      {addAccountOptions.map((option) => (
        <Option
          key={option.text}
          text={option.text}
          icon={option.icon}
          onPress={option.onPress}
          iconProps={option?.iconProps}
        >
          {isBasicAccWithImportedOneInternalKey && (
            <Alert
              type="warning"
              isTypeLabelHidden
              style={spacings.mtTy}
              text={t(
                "Although importing a key from a hardware wallet to this Basic account is possible - it's discouraged due to account's private key already being imported. Remember, the primary purpose of hardware wallets is to serve as cold storage, keeping your keys securely offline."
              )}
            />
          )}
        </Option>
      ))}
    </BottomSheet>
  )
}

export default AccountKeysBottomSheet
