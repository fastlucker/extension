import React, { useState } from 'react'
import { Image, TextInput, TouchableOpacity, View } from 'react-native'

import avatarAstronautMan from '@common/assets/images/avatars/avatar-astronaut-man.png'
import avatarAstronautWoman from '@common/assets/images/avatars/avatar-astronaut-woman.png'
import avatarFire from '@common/assets/images/avatars/avatar-fire.png'
import avatarPlanet from '@common/assets/images/avatars/avatar-planet.png'
import avatarSpaceDog from '@common/assets/images/avatars/avatar-space-dog.png'
import avatarSpaceRaccoon from '@common/assets/images/avatars/avatar-space-raccoon.png'
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import avatarSpreadFire from '@common/assets/images/avatars/avatar-spread-fire.png'
import CheckIcon from '@common/assets/svg/CheckIcon'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

import styles from './styles'

const CardImage = ({ selectedAvatar, avatar, setSelectedAvatar }: any) => (
  <TouchableOpacity activeOpacity={1} onPress={() => setSelectedAvatar(avatar)}>
    <View style={[spacings.mrTy]} key={avatar}>
      <Image
        source={avatar}
        style={{
          height: 42,
          width: 42,
          borderRadius: 10
        }}
        resizeMode="contain"
      />
      {selectedAvatar === avatar && (
        <CheckIcon
          width={12}
          height={12}
          color={colors.greenHaze}
          style={{ position: 'absolute', right: 1, bottom: 0 }}
        />
      )}
    </View>
  </TouchableOpacity>
)

const Card = ({ handleLayout, account, index }: any) => {
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
    <View style={styles.container} onLayout={(e) => handleLayout(index, e)}>
      <View
        style={[
          flexboxStyles.justifySpaceBetween,
          flexboxStyles.alignCenter,
          flexboxStyles.directionRow,
          spacings.mbSm,
          { width: 600 }
        ]}
      >
        <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter]}>
          <Image
            source={selectedAvatar}
            style={{
              height: 32,
              width: 32,
              borderRadius: 10,
              ...spacings.mrTy
            }}
            resizeMode="contain"
          />
          <Text
            shouldScale={false}
            fontSize={14}
            weight="medium"
            color={account.smartAccount ? colors.husk : colors.greenHaze}
          >
            {account.address}
          </Text>
        </View>
        <Text
          shouldScale={false}
          fontSize={14}
          weight="regular"
          color={account.smartAccount ? colors.husk : colors.greenHaze}
        >
          {t(account.smartAccount ? 'Smart Account' : 'Legacy Account')}
        </Text>
      </View>

      <Text style={[spacings.mbTy]} shouldScale={false} fontSize={14} weight="medium">
        {t('Account label')}
      </Text>
      <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mb]}>
        <TextInput
          editable
          multiline
          numberOfLines={1}
          maxLength={25}
          placeholder="Miro"
          onChangeText={(text) => setLabel(text)}
          style={[styles.textarea]}
          placeholderTextColor={colors.martinique_65}
        />
        <Text fontSize={12} shouldScale={false} style={{ color: colors.martinique_65 }}>
          {t('Use up to 25 characters')}
        </Text>
      </View>

      <Text style={[spacings.mbTy]} shouldScale={false} fontSize={14} weight="medium">
        {t('Choose an avatar')}
      </Text>

      <View style={[flexboxStyles.directionRow]}>
        {avatars.map((avatar) => (
          <CardImage
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

export default Card
