import * as Clipboard from 'expo-clipboard'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import CopyIcon from '@common/assets/svg/CopyIcon'
import LatticeIcon from '@common/assets/svg/LatticeIcon'
import LedgerIcon from '@common/assets/svg/LedgerIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import TrezorIcon from '@common/assets/svg/TrezorIcon'
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

const KeyTypeIcon: FC<{ type: Key['type'] }> = ({ type }) => {
  if (type === 'lattice') return <LatticeIcon width={71.4} height={24} />
  if (type === 'trezor') return <TrezorIcon width={16} height={24} />
  if (type === 'ledger') return <LedgerIcon width={24} height={24} />

  return <PrivateKeyIcon width={20.6} height={24} />
}

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
      addToast(t('Error copying key address'), { type: 'error' })
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
        spacings.ph,
        spacings.pvSm,
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
        {/* Keys that aren't imported can't be labeled */}
        {isImported && enableEditing ? (
          <Editable value={label || ''} onSave={editKeyLabel} maxLength={40} />
        ) : (
          <Text>{label}</Text>
        )}
        <Text fontSize={fontSize} style={spacings.mlTy}>
          {label ? `(${shortenAddress(address, 13)})` : address}
        </Text>
        <AnimatedPressable
          style={[spacings.mlSm, copyIconAnimStyle]}
          onPress={handleCopy}
          {...bindCopyIconAnim}
        >
          <CopyIcon color={theme.secondaryText} />
        </AnimatedPressable>
      </View>
      <View style={spacings.mlXl}>
        {!isImported && <Badge type="warning" text={t('Not imported')} />}
        {isImported && type && <KeyTypeIcon type={type} />}
      </View>
    </View>
  )
}

export default AccountKey
