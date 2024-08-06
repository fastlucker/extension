// @ts-nocheck

import React, { FC } from 'react'
import { Image, View, ViewStyle } from 'react-native'

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
import flexbox from '@common/styles/utils/flexbox'
import { getAvatarType } from '@common/utils/avatars'

import Blockie from './Blockies/Blockies'
import DomainBadge from './DomainBadge'
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

interface Props {
  pfp: string
  size?: number
  ens?: string | null
  ud?: string | null
  style?: ViewStyle
}

const Avatar: FC<Props> = ({ pfp, size = 40, ens, ud, style }) => {
  const selectedAccountPfp = getAccountPfpSource(pfp)
  const avatarType = getAvatarType(selectedAccountPfp)
  const borderRadius = size / 2

  if (['jazz', 'blockies'].includes(avatarType)) {
    return (
      <View style={[spacings.prTy, flexbox.alignCenter, flexbox.justifyCenter, style]}>
        {avatarType === 'jazz' && (
          <JazzIcon borderRadius={borderRadius} address={selectedAccountPfp} size={size} />
        )}
        {avatarType === 'blockies' && (
          <Blockie
            seed={selectedAccountPfp}
            width={size}
            height={size}
            borderRadius={borderRadius}
          />
        )}
        <DomainBadge ens={ens} ud={ud} />
      </View>
    )
  }

  return (
    <Image
      source={selectedAccountPfp}
      style={[spacings.mrTy, { width: size, height: size, borderRadius }]}
      resizeMode="contain"
    />
  )
}

export default Avatar
