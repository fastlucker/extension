import React, { FC, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'
import { TooltipRefProps } from 'react-tooltip'

import EnsCircularIcon from '@common/assets/svg/EnsCircularIcon'
import UnstoppableDomainCircularIcon from '@common/assets/svg/UnstoppableDomainCircularIcon'
import { Avatar } from '@common/components/Avatar'
import Editable from '@common/components/Editable'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useReverseLookup from '@common/hooks/useReverseLookup'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings, { SPACING_MI } from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import Address from './AddressBookContactAddress'
import ManageContact from './ManageContact'

interface Props {
  address: string
  name: string
  isManageable?: boolean
  isEditable?: boolean
  onPress?: () => void
  style?: ViewStyle
  testID?: string
}

const AddressBookContact: FC<Props> = ({
  address,
  name,
  isManageable,
  isEditable,
  onPress,
  testID,
  style = {}
}) => {
  const ContainerElement = onPress ? AnimatedPressable : View

  const { t } = useTranslation()
  const { theme } = useTheme()
  const { addToast } = useToast()
  const { dispatch } = useBackgroundService()
  const { ens, ud, isLoading } = useReverseLookup({ address })
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    }
  })
  const tooltipRef = useRef<TooltipRefProps>(null)
  const containerRef = useRef(null)

  const onSave = (newName: string) => {
    dispatch({
      type: 'ADDRESS_BOOK_CONTROLLER_RENAME_CONTACT',
      params: {
        address,
        newName
      }
    })
    addToast(t('Successfully renamed contact'))
  }

  const closeTooltip = useCallback(() => {
    tooltipRef?.current?.close()
  }, [])

  useEffect(() => {
    if (!isWeb) return

    if (!containerRef.current) return

    const container = containerRef.current as HTMLElement

    container.addEventListener('mouseleave', closeTooltip)

    return () => {
      container.removeEventListener('mouseleave', () => closeTooltip)
    }
  }, [closeTooltip])

  return (
    <ContainerElement
      ref={containerRef}
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        spacings.phTy,
        spacings.pvTy,
        common.borderRadiusPrimary,
        style,
        onPress && animStyle
      ]}
      onPress={onPress}
      {...(onPress ? bindAnim : {})}
      testID={testID}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <View>
          {ens || ud ? (
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
          ) : null}
          <Avatar pfp={address} size={32} />
        </View>
        <View>
          {isEditable ? (
            <Editable
              fontSize={14}
              textProps={{
                weight: 'medium'
              }}
              height={20}
              minWidth={80}
              maxLength={32}
              initialValue={name}
              onSave={onSave}
            />
          ) : (
            <Text fontSize={14} weight="medium">
              {name}
            </Text>
          )}
          {isLoading ? (
            <View
              style={{
                ...common.borderRadiusPrimary,
                backgroundColor: theme.secondaryBackground,
                width: 200,
                height: 20
              }}
            />
          ) : (
            <View style={{ height: 20 }}>
              {ens || ud ? (
                <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                  <Text fontSize={12} weight="semiBold" appearance="primary">
                    {ens || ud}
                  </Text>
                  <Address maxLength={13} address={address} style={spacings.mlMi} />
                </View>
              ) : (
                <Address maxLength={32} address={address} hideParentheses />
              )}
            </View>
          )}
        </View>
      </View>
      {isManageable ? (
        <ManageContact tooltipRef={tooltipRef} address={address} name={name} />
      ) : null}
    </ContainerElement>
  )
}

export default AddressBookContact
