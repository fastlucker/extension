import React, { FC } from 'react'
import { View } from 'react-native'

import EnsCircularIcon from '@common/assets/svg/EnsCircularIcon'
import useTheme from '@common/hooks/useTheme'
import { SPACING_MI } from '@common/styles/spacings'

interface Props {
  ens?: string | null
}

const DomainBadge: FC<Props> = ({ ens }) => {
  const { theme } = useTheme()

  if (!ens) return null

  return (
    <View
      style={{
        padding: SPACING_MI / 2,
        backgroundColor: theme.primaryBackground,
        zIndex: 2,
        borderRadius: 50
      }}
    >
      {ens && <EnsCircularIcon />}
    </View>
  )
}

export default DomainBadge
