import React, { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import AccountKey, { AccountKeyType } from '@common/components/AccountKey/AccountKey'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

interface Props {
  setCurrentKeyDetails: Dispatch<SetStateAction<AccountKeyType | null>>
  account: Account
  openAddAccountBottomSheet?: () => void
  keyIconColor?: string
  showExportImport?: boolean
}

const AccountKeys: FC<Props> = ({
  setCurrentKeyDetails,
  account,
  openAddAccountBottomSheet,
  keyIconColor,
  showExportImport
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const { keys } = useKeystoreControllerState()
  const associatedKeys = account?.associatedKeys || []
  const importedAccountKeys = keys.filter(({ addr }) => associatedKeys.includes(addr))
  const notImportedAccountKeys = associatedKeys.filter(
    (keyAddr) =>
      !importedAccountKeys.some(({ addr }) => addr.toLowerCase() === keyAddr.toLowerCase())
  )

  const accountKeys: AccountKeyType[] = [
    ...importedAccountKeys
      .map((key) => ({ isImported: true, ...key }))
      .sort((a, b) => {
        const aCreatedAt = a.meta?.createdAt
        const bCreatedAt = b.meta?.createdAt

        if (aCreatedAt === null && bCreatedAt === null) return 0
        if (aCreatedAt === null) return -1
        if (bCreatedAt === null) return 1

        return aCreatedAt - bCreatedAt
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
              account={account}
              openAddAccountBottomSheet={openAddAccountBottomSheet}
              keyIconColor={keyIconColor}
              showExportImport={showExportImport}
            />
          )
        })}
      </View>
    </>
  )
}

export default React.memo(AccountKeys)
