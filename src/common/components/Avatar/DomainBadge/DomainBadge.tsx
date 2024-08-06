import React, { FC } from 'react'
import { View } from 'react-native'

import EnsCircularIcon from '@common/assets/svg/EnsCircularIcon'
import UnstoppableDomainCircularIcon from '@common/assets/svg/UnstoppableDomainCircularIcon'
import useTheme from '@common/hooks/useTheme'
import { SPACING_MI } from '@common/styles/spacings'

interface Props {
  ens?: string | null
  ud?: string | null
}

const DomainBadge: FC<Props> = ({ ens, ud }) => {
  const { theme } = useTheme()

  if (!ens && !ud) return null

  return (
    <View
      style={{
        position: 'absolute',
        left: -SPACING_MI,
        top: -SPACING_MI,
        padding: SPACING_MI / 2,
        backgroundColor: theme.primaryBackground,
        zIndex: 2,
        borderRadius: 50
      }}
    >
      {ens && <EnsCircularIcon />}
      {ud && !ens && <UnstoppableDomainCircularIcon />}
    </View>
  )
}

export default DomainBadge
