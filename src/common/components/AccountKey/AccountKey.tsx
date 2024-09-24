import * as Clipboard from 'expo-clipboard'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, View, ViewStyle } from 'react-native'

import { Key } from '@ambire-common/interfaces/keystore'
import shortenAddress from '@ambire-common/utils/shortenAddress'
import CopyIcon from '@common/assets/svg/CopyIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Badge from '@common/components/Badge'
import Editable from '@common/components/Editable'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useHover, { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'
import { getUiType } from '@web/utils/uiType'

import AccountKeyIcon from '../AccountKeyIcon'

export type AccountKeyType = {
  isImported: boolean
  addr: Key['addr']
  dedicatedToOneSA: Key['dedicatedToOneSA']
  type?: Key['type']
  meta?: Key['meta']
  label?: string
}

type Props = AccountKeyType & {
  isLast?: boolean
  style?: ViewStyle
  enableEditing?: boolean
  handleOnKeyDetailsPress?: () => void
  showCopyAddr?: boolean
}

const { isPopup } = getUiType()

const AccountKey: React.FC<Props> = ({
  label,
  addr,
  showCopyAddr = true,
  dedicatedToOneSA,
  isLast = false,
  type,
  isImported,
  style,
  enableEditing = true,
  handleOnKeyDetailsPress
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { addToast } = useToast()
  const { dispatch } = useBackgroundService()
  const [bindKeyDetailsAnim, keyDetailsAnimStyles] = useCustomHover({
    property: 'left',
    values: {
      from: 0,
      to: 4
    }
  })
  const [bindCopyIconAnim, copyIconAnimStyle] = useHover({
    preset: 'opacityInverted'
  })
  const fontSize = isPopup ? 14 : 16

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(addr)
      addToast(t('Key address copied to clipboard'), { type: 'success' })
    } catch {
      addToast(t('Could not copy the key address to the clipboard'), { type: 'error' })
    }
  }

  const editKeyLabel = (newLabel: string) => {
    dispatch({
      type: 'KEYSTORE_CONTROLLER_UPDATE_KEY_PREFERENCES',
      params: [
        {
          addr,
          type: type || 'internal',
          preferences: { label: newLabel }
        }
      ]
    })
    addToast(t('Key label updated'), { type: 'success' })
  }

  const shortAddr = shortenAddress(addr, 13)

  return (
    <View
      style={[
        spacings.phSm,
        isImported ? spacings.pvTy : spacings.pvSm,
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
            <AccountKeyIcon type={type || 'internal'} />
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
              initialValue={label || ''}
              onSave={editKeyLabel}
              maxLength={40}
            />
          ) : (
            <Text weight="semiBold" fontSize={fontSize} numberOfLines={1}>
              {label}
            </Text>
          )}
        </View>
        <Text
          color={dedicatedToOneSA ? theme.infoDecorative : theme.primaryText}
          fontSize={fontSize - 1}
          weight={dedicatedToOneSA ? 'semiBold' : 'regular'}
          style={[
            label || isImported ? spacings.mlMi : {},
            // Reduce the letter spacing as a hack to be able to fit all elements
            // on the row, even for the extreme case when the key label is max length
            dedicatedToOneSA && { letterSpacing: -0.2 }
          ]}
        >
          {dedicatedToOneSA ? t('(dedicated key)') : label ? `(${shortAddr})` : addr}
        </Text>
        {showCopyAddr && (
          <AnimatedPressable
            style={[spacings.mlTy, copyIconAnimStyle]}
            onPress={handleCopy}
            {...bindCopyIconAnim}
          >
            <CopyIcon width={fontSize + 4} height={fontSize + 4} color={theme.secondaryText} />
          </AnimatedPressable>
        )}
      </View>
      {isImported ? (
        handleOnKeyDetailsPress && (
          <AnimatedPressable
            onPress={handleOnKeyDetailsPress}
            style={[flexbox.directionRow, flexbox.alignCenter]}
            {...bindKeyDetailsAnim}
          >
            <Text fontSize={14} appearance="secondaryText" weight="medium" style={spacings.mrTy}>
              {t('Details')}
            </Text>
            <Animated.View style={keyDetailsAnimStyles}>
              <RightArrowIcon width={16} height={16} color={theme.secondaryText} />
            </Animated.View>
          </AnimatedPressable>
        )
      ) : (
        <View style={isPopup ? spacings.ml : spacings.mlXl}>
          <Badge type="warning" text={t('Not imported')} />
        </View>
      )}
    </View>
  )
}

export default React.memo(AccountKey)
