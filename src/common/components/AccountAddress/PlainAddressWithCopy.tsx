import * as Clipboard from 'expo-clipboard'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import CopyIcon from '@common/assets/svg/CopyIcon'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import flexbox from '@common/styles/utils/flexbox'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'

import PlainAddress from './PlainAddress'

interface Props {
  maxLength: number
  address: string
  style?: any
  hideParentheses?: boolean
}

const PlainAddressWithCopy: FC<Props> = ({ maxLength, address, style, hideParentheses }) => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { theme } = useTheme()
  const [bindAnim, animStyle] = useHover({
    preset: 'opacityInverted'
  })

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(address)
      addToast(t('Address copied to clipboard'))
    } catch {
      addToast(t('Failed to copy address'))
    }
  }

  return (
    <AnimatedPressable
      onPress={handleCopy}
      style={[flexbox.directionRow, flexbox.alignCenter, animStyle]}
      {...bindAnim}
    >
      <PlainAddress
        maxLength={maxLength}
        address={address}
        hideParentheses={hideParentheses}
        style={style}
      />
      <CopyIcon width={14} height={14} color={theme.secondaryText} />
    </AnimatedPressable>
  )
}

export default PlainAddressWithCopy
