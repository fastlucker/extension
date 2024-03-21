import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import { KeyPreferences } from '@ambire-common/interfaces/settings'
import AccountKey from '@common/components/AccountKey'
import BottomSheet from '@common/components/BottomSheet'
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
  label?: string
}

const Title = ({ text }: { text: string }) => (
  <Text fontSize={18} weight="medium" style={spacings.mbSm}>
    {text}
  </Text>
)

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
        label: keyPreferences.find((x) => x.addr === key.addr && x.type === key.type)?.label
      }))
      .sort((a, b) => {
        const matchA = a.label?.match(DEFAULT_KEY_LABEL_PATTERN)
        const matchB = b.label?.match(DEFAULT_KEY_LABEL_PATTERN)

        if (matchA && matchB) {
          return +matchA[1] - +matchB[1]
        }
        if (matchA) {
          return -1
        }
        if (matchB) {
          return 1
        }

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
      <Title text={t('Account keys')} />
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
        {accountKeys.map(({ type, addr, label, isImported }, index) => {
          return (
            <AccountKey
              key={addr + type}
              label={label}
              address={addr}
              type={type}
              isLast={index === accountKeys.length - 1}
              isImported={isImported}
            />
          )
        })}
      </View>
      <Title text={t('Import more keys')} />
      {addAccountOptions.map((option) => (
        <Option
          key={option.text}
          text={option.text}
          icon={option.icon}
          onPress={option.onPress}
          iconProps={option?.iconProps}
        />
      ))}
    </BottomSheet>
  )
}

export default AccountKeysBottomSheet
