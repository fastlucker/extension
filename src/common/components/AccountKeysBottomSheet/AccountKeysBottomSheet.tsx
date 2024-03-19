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

import { getAddKeyOptions } from './helpers/getAddKeyOptions'

interface Props {
  sheetRef: any
  associatedKeys: string[]
  keyPreferences: KeyPreferences
  keys: Key[]
  importedAccountKeys: Key[]
  closeBottomSheet: () => void
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
  keys,
  importedAccountKeys,
  closeBottomSheet
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const addAccountOptions = getAddKeyOptions({
    navigate,
    t
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
        {associatedKeys.map((key, index) => {
          const { type } = keys.find(({ addr }) => addr === key) || {}
          const { label } = keyPreferences.find((x) => x.addr === key && x.type === type) || {}
          const isImported = !!importedAccountKeys.find(
            ({ addr, type: keyType }) => addr === key && keyType === type
          )

          return (
            <AccountKey
              key={key}
              label={label}
              address={key}
              type={type}
              isLast={index === associatedKeys.length - 1}
              isImported={isImported}
            />
          )
        })}
      </View>
      <Title text={t('Import keys')} />
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
