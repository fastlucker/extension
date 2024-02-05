// @ts-nocheck

import React from 'react'
import { Image, View } from 'react-native'

import { isValidAddress } from '@ambire-common/services/address'
import avatarAstronautMan from '@common/assets/images/avatars/avatar-astronaut-man.png'
import avatarAstronautWoman from '@common/assets/images/avatars/avatar-astronaut-woman.png'
import avatarFire from '@common/assets/images/avatars/avatar-fire.png'
import avatarPlanet from '@common/assets/images/avatars/avatar-planet.png'
import avatarSpaceDog from '@common/assets/images/avatars/avatar-space-dog.png'
import avatarSpaceRaccoon from '@common/assets/images/avatars/avatar-space-raccoon.png'
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import avatarSpreadFire from '@common/assets/images/avatars/avatar-spread-fire.png'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { getAvatarType } from '@common/utils/avatars'

import Blockie from './Blockies/Blockies'
import JazzIcon from './Jazz'

export {
  avatarAstronautMan,
  avatarAstronautWoman,
  avatarFire,
  avatarPlanet,
  avatarSpaceDog,
  avatarSpaceRaccoon,
  avatarSpace,
  avatarSpreadFire
}

export const BUILD_IN_AVATAR_ID_PREFIX = 'AMBIRE-BUILD-IN-AVATAR-'

export const buildInAvatars = [
  { id: `${BUILD_IN_AVATAR_ID_PREFIX}1`, source: avatarAstronautMan },
  { id: `${BUILD_IN_AVATAR_ID_PREFIX}2`, source: avatarAstronautWoman },
  { id: `${BUILD_IN_AVATAR_ID_PREFIX}3`, source: avatarFire },
  { id: `${BUILD_IN_AVATAR_ID_PREFIX}4`, source: avatarPlanet },
  { id: `${BUILD_IN_AVATAR_ID_PREFIX}5`, source: avatarSpaceDog },
  { id: `${BUILD_IN_AVATAR_ID_PREFIX}6`, source: avatarSpaceRaccoon },
  { id: `${BUILD_IN_AVATAR_ID_PREFIX}7`, source: avatarSpace },
  { id: `${BUILD_IN_AVATAR_ID_PREFIX}8`, source: avatarSpreadFire }
]

const DEFAULT_AVATAR = buildInAvatars[0]
export const getAccountPfpSource = (pfpId: string) => {
  // address for the Blockie
  if (isValidAddress(pfpId)) return pfpId

  return buildInAvatars.find(({ id }) => id === pfpId)?.source || DEFAULT_AVATAR.source
}

export const Avatar = React.memo(({ pfp, size = 40 }: { pfp: string; size?: number }) => {
  const selectedAccountPfp = getAccountPfpSource(pfp)
  const avatarType = getAvatarType(selectedAccountPfp)

  if (['jazz', 'blockies'].includes(avatarType)) {
    return (
      <View style={[spacings.prTy, flexbox.alignCenter, flexbox.justifyCenter]}>
        {avatarType === 'jazz' && <JazzIcon address={selectedAccountPfp} size={size} />}
        {avatarType === 'blockies' && (
          <Blockie seed={selectedAccountPfp} width={size} height={size} />
        )}
      </View>
    )
  }

  return (
    <Image
      source={selectedAccountPfp}
      style={[common.borderRadiusPrimary, spacings.mrTy, { width: size, height: size }]}
      resizeMode="contain"
    />
  )
})
