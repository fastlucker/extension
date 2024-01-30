import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import CheckIcon from '@common/assets/svg/CheckIcon'
import EditPenIcon from '@common/assets/svg/EditPenIcon'
import { Avatar } from '@common/components/Avatar'
import Badge from '@common/components/Badge'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

export type AccountPersonalizeFormValues = {
  preferences: {
    account: Account
    label: string
    pfp: string
  }[]
}

type Props = {
  address: Account['addr']
  isSmartAccount: boolean
  pfp: string
  index: number
  control: Control<AccountPersonalizeFormValues>
  hasBottomSpacing?: boolean
}

const AccountPersonalizeCard = ({
  address,
  isSmartAccount,
  index,
  pfp,
  control,
  hasBottomSpacing = true
}: Props) => {
  const { styles, theme } = useTheme(getStyles)
  const { t } = useTranslation()

  const [editNameEnabled, setEditNameEnabled] = useState(false)

  return (
    <View style={[styles.container, !hasBottomSpacing && spacings.mb0]}>
      <View style={[flexbox.justifySpaceBetween, flexbox.alignCenter, flexbox.directionRow]}>
        <View style={[flexbox.directionRow, flexbox.alignCenter]}>
          <Avatar pfp={pfp} />
          <View style={flexbox.flex1}>
            <View style={[flexbox.directionRow, flexbox.alignCenter]}>
              <Text fontSize={14} style={spacings.mrLg}>
                {address}
              </Text>
              {isSmartAccount ? (
                <Badge withIcon type="success" text={t('Smart Account')} />
              ) : (
                <Badge withIcon type="warning" text={t('Legacy Account')} />
              )}
            </View>

            <Controller
              control={control}
              name={`preferences.${index}.label`}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[{ height: 24 }, flexbox.justifyCenter]}>
                  {!!editNameEnabled && (
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      numberOfLines={1}
                      maxLength={40}
                      autoFocus
                      error={!value.length && ' '}
                      inputWrapperStyle={{ height: 20 }}
                      inputStyle={{
                        height: 18,
                        ...spacings.phTy
                      }}
                      buttonStyle={spacings.phMi}
                      nativeInputStyle={{ fontSize: 12 }}
                      containerStyle={{ ...spacings.mb0, height: 20, maxWidth: 310 }}
                      style={{ height: 20 }}
                      editable={editNameEnabled}
                      button={
                        <CheckIcon color="transparent" checkColor={theme.successDecorative} />
                      }
                      buttonProps={{
                        onPress: () => {
                          if (value.length) {
                            setEditNameEnabled(false)
                          }
                        }
                      }}
                    />
                  )}
                  {!editNameEnabled && (
                    <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                      <Text
                        fontSize={14}
                        weight="semiBold"
                        appearance="secondaryText"
                        style={spacings.mrTy}
                      >
                        {value}
                      </Text>
                      <Pressable onPress={() => setEditNameEnabled(true)}>
                        {({ hovered }: any) => (
                          <EditPenIcon
                            width={14}
                            height={14}
                            color={hovered ? theme.primary : theme.primaryLight}
                          />
                        )}
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </View>

      {/* <Text style={[spacings.mbTy]} fontSize={14} appearance="secondaryText">
        {t('Choose an avatar')}
      </Text> */}
      {/* <View style={[flexbox.directionRow]}>
        <Controller
          control={control}
          name={`preferences.${index}.pfp`}
          render={({ field: { onChange, value } }) => (
            <>
              {buildInAvatars.map(({ id, source }) => (
                <AvatarsSelectorItem
                  key={id}
                  id={id}
                  source={source}
                  isSelected={value === id}
                  setSelectedAvatar={onChange}
                />
              ))}
            </>
          )}
        />
      </View> */}
    </View>
  )
}

export default React.memo(AccountPersonalizeCard)
