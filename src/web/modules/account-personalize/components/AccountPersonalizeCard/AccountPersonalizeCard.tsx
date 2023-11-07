import React, { useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import CheckIcon from '@common/assets/svg/CheckIcon'
import Input from '@common/components/Input'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { setSuccessLabel, setWarningLabel } from '@web/modules/account-adder/components/Account'

import {
  avatarAstronautMan,
  avatarAstronautWoman,
  avatarFire,
  avatarPlanet,
  avatarSpace,
  avatarSpaceDog,
  avatarSpaceRaccoon,
  avatarSpreadFire
} from './avatars'
import getStyles from './styles'

const AvatarsSelectorItem = ({ selectedAvatar, avatar, setSelectedAvatar }: any) => {
  const { styles, theme } = useTheme(getStyles)
  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setSelectedAvatar(avatar)}>
      <View style={[spacings.mrTy]} key={avatar}>
        <Image source={avatar} style={styles.pfpSelectorItem} resizeMode="contain" />
        {selectedAvatar === avatar && (
          <CheckIcon
            width={14}
            height={14}
            color={theme.successDecorative}
            style={{ position: 'absolute', right: 0, bottom: 0 }}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

type Props = {
  account: Account
  hasBottomSpacing?: boolean
}

const AccountPersonalizeCard = ({ account, hasBottomSpacing = true }: Props) => {
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const [selectedAvatar, setSelectedAvatar] = useState(avatarAstronautMan)
  const [label, setLabel] = useState('')
  const avatars = [
    avatarAstronautMan,
    avatarAstronautWoman,
    avatarSpaceDog,
    avatarSpace,
    avatarSpaceRaccoon,
    avatarPlanet,
    avatarFire,
    avatarSpreadFire
  ]

  return (
    <View style={[styles.container, !hasBottomSpacing && spacings.mb0]}>
      <View
        style={[
          flexboxStyles.justifySpaceBetween,
          flexboxStyles.alignCenter,
          flexboxStyles.directionRow,
          spacings.mbSm,
          { width: 600 }
        ]}
      >
        <View style={[flexboxStyles.directionRow]}>
          <Image source={selectedAvatar} style={styles.pfp} resizeMode="contain" />
          <View style={{ alignItems: 'flex-start' }}>
            <Text fontSize={16} weight="medium" style={spacings.mb}>
              {account.addr}
            </Text>
            {account.creation
              ? setSuccessLabel(t('Smart Account'))
              : setWarningLabel(t('Legacy Account'))}
          </View>
        </View>
      </View>

      <Text style={[spacings.mbTy]} fontSize={14} appearance="secondaryText">
        <Text fontSize={14} appearance="secondaryText">
          {t('Account label')}
        </Text>
        {'  '}
        <Text weight="light" appearance="secondaryText" fontSize={12}>
          {t('(Use up to 25 characters)')}
        </Text>
      </Text>

      <Input
        numberOfLines={1}
        maxLength={25}
        placeholder="Miro"
        onChangeText={(text) => setLabel(text)}
        containerStyle={[spacings.mbLg, { maxWidth: 320 }]}
      />
      <Text style={[spacings.mbTy]} fontSize={14} appearance="secondaryText">
        {t('Choose an avatar')}
      </Text>
      <View style={[flexboxStyles.directionRow]}>
        {avatars.map((avatar) => (
          <AvatarsSelectorItem
            key={avatar}
            avatar={avatar}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
          />
        ))}
      </View>
    </View>
  )
}

export default React.memo(AccountPersonalizeCard)
