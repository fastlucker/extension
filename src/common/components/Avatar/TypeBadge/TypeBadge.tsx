import React, { FC } from 'react'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import BADGE_PRESETS from '@common/components/BadgeWithPreset/presets'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import { SPACING_MI } from '@common/styles/spacings'

interface Props {
  isSmart: boolean
  type?: string
  showTooltip?: boolean
}

const TypeBadge: FC<Props> = ({ isSmart, type, showTooltip = false }) => {
  const { theme } = useTheme()
  const badgePreset = isSmart ? BADGE_PRESETS['smart-account'] : BADGE_PRESETS['basic-account']
  const tooltipId = uuidv4()

  return (
    <>
      <View
        // @ts-ignore
        dataSet={{ tooltipId }}
        style={{
          position: 'absolute',
          left: type === 'big' ? -SPACING_MI / 2 : -SPACING_MI,
          top: type === 'big' ? -SPACING_MI / 2 : -SPACING_MI,
          paddingHorizontal: 3,
          paddingVertical: 2,
          backgroundColor: isSmart ? theme.successDecorative : theme.warningDecorative,
          zIndex: 2,
          borderRadius: 50,
          borderWidth: type === 'big' ? 3 : 2,
          borderColor: '#fff'
        }}
      >
        <Text color="#fff" weight="semiBold" fontSize={type === 'big' ? 10 : 9}>
          {isSmart ? 'SA' : 'BA'}
        </Text>
      </View>
      {showTooltip && <Tooltip id={tooltipId} content={badgePreset.tooltipText} />}
    </>
  )
}

export default TypeBadge
