import React, { FC, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'
import { TooltipRefProps } from 'react-tooltip'

import Avatar from '@common/components/Avatar'
import Editable from '@common/components/Editable'
import Text from '@common/components/Text'
import { isWeb } from '@common/config/env'
import useReverseLookup from '@common/hooks/useReverseLookup'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import AccountAddress from '../AccountAddress'
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
        <Avatar ens={ens} ud={ud} pfp={address} size={32} />
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
          <AccountAddress isLoading={isLoading} ens={ens} ud={ud} address={address} />
        </View>
      </View>
      {isManageable ? (
        <ManageContact tooltipRef={tooltipRef} address={address} name={name} />
      ) : null}
    </ContainerElement>
  )
}

export default AddressBookContact
