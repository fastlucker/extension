// @ts-nocheck
import avatarAstronautMan from '@common/assets/images/avatars/avatar-astronaut-man.png'
import avatarAstronautWoman from '@common/assets/images/avatars/avatar-astronaut-woman.png'
import avatarFire from '@common/assets/images/avatars/avatar-fire.png'
import avatarPlanet from '@common/assets/images/avatars/avatar-planet.png'
import avatarSpaceDog from '@common/assets/images/avatars/avatar-space-dog.png'
import avatarSpaceRaccoon from '@common/assets/images/avatars/avatar-space-raccoon.png'
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import avatarSpreadFire from '@common/assets/images/avatars/avatar-spread-fire.png'

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
export const getAccountPfpSource = (pfpId: string) =>
  buildInAvatars.find(({ id }) => id === pfpId)?.source || DEFAULT_AVATAR.source
