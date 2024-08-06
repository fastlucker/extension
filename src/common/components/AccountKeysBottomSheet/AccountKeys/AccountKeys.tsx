import React, { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import { KeyPreferences } from '@ambire-common/interfaces/settings'
import { DEFAULT_KEY_LABEL_PATTERN } from '@ambire-common/libs/keys/keys'
import AccountKey, { AccountKeyType } from '@common/components/AccountKey/AccountKey'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

interface Props {
  associatedKeys: string[]
  keyPreferences: KeyPreferences
  importedAccountKeys: Key[]
  setCurrentKeyDetails: Dispatch<SetStateAction<AccountKeyType | null>>
}

const AccountKeys: FC<Props> = ({
  associatedKeys,
  importedAccountKeys,
  keyPreferences,
  setCurrentKeyDetails
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

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
        dedicatedToOneSA: key.dedicatedToOneSA,
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
      addr: keyAddr,
      dedicatedToOneSA: false
    }))
  ]

  return (
    <>
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
        {accountKeys.map(({ type, addr, label, isImported, meta, dedicatedToOneSA }, index) => {
          const isLast = index === accountKeys.length - 1
          const accountKeyProps = { label, addr, type, isLast, isImported }

          const handleOnKeyDetailsPress = () => {
            setCurrentKeyDetails({ type, addr, label, isImported, meta, dedicatedToOneSA })
          }

          return (
            <AccountKey
              key={addr + type}
              meta={meta}
              dedicatedToOneSA={dedicatedToOneSA}
              showCopyAddr={!dedicatedToOneSA}
              {...accountKeyProps}
              handleOnKeyDetailsPress={handleOnKeyDetailsPress}
            />
          )
        })}
      </View>
    </>
  )
}

export default AccountKeys
