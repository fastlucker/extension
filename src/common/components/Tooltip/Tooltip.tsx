import React from 'react'
import { ITooltip, Tooltip as ReactTooltip } from 'react-tooltip'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
import useTheme from '@common/hooks/useTheme'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import { Portal } from '@gorhom/portal'

const Tooltip = ({ style, ...rest }: ITooltip) => {
  const { theme } = useTheme()
  return (
    <Portal hostName="global">
      <ReactTooltip
        place="top"
        delayShow={150}
        variant="light"
        style={{
          maxWidth: 380,
          fontSize: 14,
          fontFamily: FONT_FAMILIES.REGULAR,
          backgroundColor: theme.tertiaryBackground as any,
          color: theme.secondaryText as any,
          borderRadius: BORDER_RADIUS_PRIMARY,
          zIndex: 1000,
          ...style
        }}
        opacity={1}
        border={`1px solid ${theme.secondaryBorder as any}`}
        {...rest}
      />
    </Portal>
  )
}

export default Tooltip
