import * as Clipboard from 'expo-clipboard'
import React, { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import CopyIcon from '@common/assets/svg/CopyIcon'
import LatticeMiniIcon from '@common/assets/svg/LatticeMiniIcon'
import LedgerMiniIcon from '@common/assets/svg/LedgerMiniIcon'
import PrivateKeyMiniIcon from '@common/assets/svg/PrivateKeyMiniIcon'
import TrezorMiniIcon from '@common/assets/svg/TrezorMiniIcon'
import Badge from '@common/components/Badge'
import Editable from '@common/components/Editable'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useHover, { AnimatedPressable } from '@web/hooks/useHover'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

interface Props {
  address: string
  isLast: boolean
  isImported: boolean
  type?: Key['type']
  label?: string
  style?: ViewStyle
  enableEditing?: boolean
}

const { isPopup } = getUiType()

const KeyTypeIcon: FC<{ type: Key['type'] }> = memo(({ type }) => {
  if (type === 'lattice') return <LatticeMiniIcon width={24} height={24} />
  if (type === 'trezor') return <TrezorMiniIcon width={24} height={24} />
  if (type === 'ledger') return <LedgerMiniIcon width={24} height={24} />

  return <PrivateKeyMiniIcon width={24} height={24} />
})

const AccountKey: React.FC<Props> = ({
  label,
  address,
  isLast,
  type,
  isImported,
  style,
  enableEditing = true
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { addToast } = useToast()
  const { dispatch } = useBackgroundService()
  const [bindCopyIconAnim, copyIconAnimStyle] = useHover({
    preset: 'opacityInverted'
  })
  const fontSize = isPopup ? 14 : 16

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(address)
      addToast(t('Key address copied to clipboard'), { type: 'success' })
    } catch {
      addToast(t('Could not copy the key address to the clipboard'), { type: 'error' })
    }
  }

  const editKeyLabel = (newLabel: string) => {
    dispatch({
      type: 'MAIN_CONTROLLER_SETTINGS_ADD_KEY_PREFERENCES',
      params: [
        {
          addr: address,
          type: type || 'internal',
          label: newLabel
        }
      ]
    })
    addToast(t('Key label updated'), { type: 'success' })
  }

  return (
    <View
      style={[
        spacings.phSm,
        spacings.pvTy,
        flexbox.directionRow,
        flexbox.justifySpaceBetween,
        flexbox.alignCenter,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.secondaryBorder
        },
        style
      ]}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        {isImported && (
          <View style={spacings.mrTy}>
            <KeyTypeIcon type={type || 'internal'} />
          </View>
        )}
        <View style={isPopup ? { maxWidth: 350 } : {}}>
          {/* Keys that aren't imported can't be labeled */}
          {isImported && enableEditing ? (
            <Editable
              textProps={{
                weight: 'semiBold'
              }}
              fontSize={fontSize}
              value={label || ''}
              onSave={editKeyLabel}
              maxLength={40}
            />
          ) : (
            <Text weight="semiBold" fontSize={fontSize} numberOfLines={1}>
              {label}
            </Text>
          )}
        </View>
        <Text fontSize={fontSize} style={label || isImported ? spacings.mlTy : {}}>
          {label ? `(${shortenAddress(address, 13)})` : address}
        </Text>
        <AnimatedPressable
          style={[spacings.mlTy, copyIconAnimStyle]}
          onPress={handleCopy}
          {...bindCopyIconAnim}
        >
          <CopyIcon width={fontSize + 4} height={fontSize + 4} color={theme.secondaryText} />
        </AnimatedPressable>
      </View>
      {!isImported && (
        <View style={isPopup ? spacings.ml : spacings.mlXl}>
          <Badge type="warning" text={t('Not imported')} />
        </View>
      )}
    </View>
  )
}

export default AccountKey
